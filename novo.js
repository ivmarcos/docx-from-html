const docx = require('docx');
const axios = require('axios');
const fs = require('fs');

const helpers = require('./docxHelpers');
const path = require('path');

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3siaWRVc2VyIjozMCwiaWRUeXBlIjoxLCJmaXJzdE5hbWUiOiJDb2xvbWJpYSIsImxhc3ROYW1lIjoiVXN1YXJpbyIsImVtYWlsIjoiY29sb21iaWFAc2ltcGxpZmljYS5zbSIsInBhc3N3b3JkIjoiVTJGc2RHVmtYMThLU0FYY1hXNDRRZDN5NjZINE9IaDJ5OFdVS1lnS2FzTT0iLCJzaGFyZU15UXVlc3Rpb25zIjoxLCJwaG90byI6Ik16QXRNVFUwTVRRME1qazBORGMyT0E9PS5wbmciLCJ0aW1lem9uZSI6bnVsbCwiaWRDb3VudHJ5IjoxNSwiYWJicmV2aWF0aW9uIjoiQ08iLCJsYW5ndWFnZSI6ImVzIiwiY291bnRyeU5hbWUiOiJDb2xvbWJpYSIsImlkU2Nob29sIjoxNywic2Nob29sTmFtZSI6IkVzY3VlbGEgQ29sb21iaWEgU00ifV0.x1LZKDkn3SbM8mcmIMmrYyI11PJrLJMeyPcj91nmEs4';
const ID_ASSESSMENT = 3632;


const api = axios.create({
      baseURL: 'http://dev-teapi.smbrasil.com.br/cp/assessments',
      headers: {
        'X-Auth-Token': TOKEN,
        'Accept-Encoding': 'gzip, deflate',
      },
    });

const imageBase64Data = `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`

const locale = 'pt';

const intl = {
  ES: {
    version: 'Versión',
    selectAlternative: 'Selecciona la opción correcta',
    name: 'Nombre',
    group: 'Grupo',
    date: 'Fecha'
  },
  EN: {
    version: 'Versión',
    selectAlternative: 'Selecciona la opción correcta',
    name: 'Nombre',
    group: 'Grupo',
    date: 'Fecha'
  },
  PT: {
    version: 'Versão',
    selectAlternative: 'Selecione a alternativa correta',
    name: 'Nome',
    group: 'Grupo',
    date: 'Data'
  },
};

api.post('/assessmentPreview.php', { idAssessment: ID_ASSESSMENT }).then(async responsePreview => {
    const preview = responsePreview.data.content;
    const questions = preview.versions['1'];
   
    
    const questionsPromises = questions.map(async question => {
        const questionParsed = await helpers.parseHtml(question.text);
        const alternativesPromise = question.alternatives.map(async alternative => await helpers.parseHtml(alternative.text));
        const alternativesResolved = await Promise.all(alternativesPromise);
        return {
            ...questionParsed,
            alternatives: alternativesResolved
        }
    })
    
    const localeText = intl[locale.toUpperCase()] || intl.ES;

    const doc = new docx.Document();
    const questionsResolved = await Promise.all(questionsPromises);
//    const numbering = new docx.Numbering();

    //console.log(questionsResolved);

    const {
      version,
      logo, 
      subtitle,
      title
    } = preview;

    function insertHeader(){
      const paragraphTitle = new docx.Paragraph(title).size(50).spacing({before: 100}).bold().center();;
      const paragraphSubtitle = new docx.Paragraph(subtitle).spacing({after: 100}).bold().center();;
      const paragraphVersionLabel = new docx.Paragraph(localeText.version).bold().center();;
      const paragraphVersion = new docx.Paragraph(version).size(75).bold().center();;
      if (logo){
        const image = helpers.getMetadata(logo);
        doc.createImage(image.buffer, image.meta.width, image.meta.height)
      }
      doc.addParagraph(paragraphTitle);
      doc.addParagraph(paragraphSubtitle);
      doc.addParagraph
      doc.addParagraph(paragraphVersionLabel);
      doc.addParagraph(paragraphVersion)
    }

    function insertField(label){
      const paragraph = new docx.Paragraph(label);
      const paragraphLine = new docx.Paragraph(" ").thematicBreak();
      doc.addParagraph(paragraph);
      doc.addParagraph(paragraphLine)
    }

    function insertQuestionParagraph(question, questionIndex){
      doc.addParagraph(new docx.Paragraph("").thematicBreak());
      const paragraph = new docx.Paragraph().spacing({before: 100, after: 100});
      paragraph.addRun(new docx.TextRun(questionIndex + 1 + ') ').bold());
      paragraph.addRun(new docx.TextRun(question.text));
      doc.addParagraph(paragraph);
      const paragraphAlternativeSelect = new docx.Paragraph(localeText.selectAlternative).spacing({before: 100, after: 100});
      doc.addParagraph(paragraphAlternativeSelect);
    }

    function insertAlternativeParagraph(alternative, letterNumbering){
      const paragraph = new docx.Paragraph().setNumbering(letterNumbering, 0)
      paragraph.addRun(new docx.TextRun(alternative.text));
      doc.addParagraph(paragraph);
    }

    function insertQuestions(){
      const numberedAbstract = doc.Numbering.createAbstractNumbering();
      numberedAbstract.createLevel(0, "lowerLetter", "%1)", "left");
      questionsResolved.forEach((question, questionIndex) => {
          insertQuestionParagraph(question, questionIndex);
          question.images.forEach(image => doc.createImage(image.buffer, image.meta.width, image.meta.height));
          const letterNumbering = doc.Numbering.createConcreteNumbering(numberedAbstract);
          question.alternatives.forEach(alternative => {
              insertAlternativeParagraph(alternative, letterNumbering);
              alternative.images.forEach(image => doc.createImage(image.buffer, image.meta.width, image.meta.height));
         })
      })
    }

    insertHeader();
    insertField(localeText.name);
    insertField(localeText.group);
    insertField(localeText.date);
    insertQuestions();

    
    const packer = new docx.Packer();
    packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("teste" + new Date().getTime() + '.docx', buffer);
    });

    // const paragraph = new docx.Paragraph("Some cool text here.");
    // paragraph.addRun(new docx.TextRun("Lorem Ipsum Foo Bar"));

    // doc.createImage(Buffer.from(imageBase64Data, 'base64'),);

    // Used to export the file into a .docx file
   
}).catch(err => console.error(err));

/*
  const b64string = await packer.toBase64String(doc);
    
    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
*/
// const paragraph = new docx.Paragraph("Some cool text here.");
// doc.addParagraph(paragraph);
// const packer = new docx.Packer();
// packer.toBuffer(doc).then((buffer) => {
//     fs.writeFileSync("My First Document.docx", buffer);
// });


