module.exports = function(app){
    const highlight = require('../controllers/highlightController');

    app.get('/highlights/pdfs/:pdfIdx',  highlight.getHighlight);
    app.post('/highlights', highlight.postHighlight);
    app.get('/highlights/pdfs/:pdfIdx/pages/:pageNum', highlight.getPageHighlight);
    // app.get('/highlights/pdfs/:pdfIdx/pages/:pageNum/commitIdx/:commitIdx', highlight.getCommitHighlight);
    app.get('/highlights/pages/:pageNum/commitIdx/:commitIdx', highlight.getCommitHighlight);
    app.delete('/highlights/:highlightIdx', highlight.deleteHighlight);
};