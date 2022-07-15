module.exports = function(app){
    const highlight = require('../controllers/highlightController');

    app.get('/highlights/pdfs/:pdfIdx',  highlight.getHighlight);
    app.post('/highlights', highlight.postHighlight);
    app.get('/highlights/pdfs/:pdfIdx/pages/:pageNum', highlight.getPageHighlight);

    app.delete('/highlights/:highlightIdx', highlight.deleteHighlight);

};