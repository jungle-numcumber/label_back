module.exports = function(app){
    const search = require('../controllers/searchController');

    app.get('/pdfs/:pdfIdx/highlights/search',  search.searchHighlight);
    app.get('/pdfs/library/search', search.searchBooks);
};