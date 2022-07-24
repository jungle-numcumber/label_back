module.exports = function(app){
  const upload = require('../controllers/uploadController');

  app.post('/upload', upload.postBook); 
}