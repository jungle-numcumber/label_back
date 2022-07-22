module.exports = function(app){
  const editor = require('../controllers/editorController');

  app.get('/editor/pdfs/:pdfIdx/pages/:pageNum', editor.getPageHighlightMemo); 
}