module.exports = function(app){
    const pdf = require('../controllers/pdfController');

    app.get('/users/:userIdx/pdfs',  pdf.getPdfAll);
    app.get('/pdfs/:pdfIdx/pages/:pageNum',  pdf.getPdfPage);
    app.get('/pdfs/lastIdx', pdf.getLastIdx);
};