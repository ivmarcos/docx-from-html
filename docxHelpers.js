
const extractor = require('textract');

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
   }
}

module.exports = Helpers;