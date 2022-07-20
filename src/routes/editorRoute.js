module.exports = function(app){
    const editor = require('../controllers/editorController');
    
    app.get('/editor', editor.getEditor);
};