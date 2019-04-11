
const extractor = require('textract');
const {parse} = require('node-html-parser');
const uriToBuffer = require('data-uri-to-buffer')
const sizeOf = require('image-size');

const Helpers =  {
  htmlToText(html){
    const buffer = Buffer.from(html, 'utf8');
    return new Promise((resolve, reject) => {
        extractor.fromBufferWithMime('text/html', buffer, (error, text) => {
            if (error){
                reject(error);
                return;
            }
            resolve(text);
        });
    })
   },
   extractImagesFromHtml(html){
    const root = parse(html);
    const imgs = root.querySelectorAll('img');
    return imgs.map(img => img.attributes.src).filter(src => /data.*base64/g.test(src.slice(0,50))).map(src => uriToBuffer(src.replace(/"/g, ''))).map(buffer => ({buffer, meta: sizeOf(buffer)}));
   },
   async parseHtml(html){
       const text = await Helpers.htmlToText(html);
       const images = Helpers.extractImagesFromHtml(html);
       return {
           text,
           images
       }
   }
}

module.exports = Helpers;