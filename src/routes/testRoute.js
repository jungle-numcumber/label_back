module.exports = function(app){
    const test = require('../controllers/testController');

    app.get('/test',  test.first);
    app.get('/dbtests',  test.getTest);

};