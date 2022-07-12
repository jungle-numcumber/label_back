module.exports = function(app){
    const pdf = require('../controllers/pdfController');

    app.get('/:userIdx/pdfs',  pdf.getPdfAll);
    app.get('/:pdfIdx/:pageNum',  pdf.getPdfPage);

};