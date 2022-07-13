module.exports = function(app){
    const highlight = require('../controllers/highlightController');

    app.get('/highlights/:pdfIdx',  highlight.getHighlight);
    app.post('/highlights', highlight.postHighlight);
    app.get('/highlights/pdfs/:pdfIdx/pages/:pageNum', highlight.getPageHighlight);

};