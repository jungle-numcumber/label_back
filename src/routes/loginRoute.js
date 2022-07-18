module.exports = function(app){
    const loginController = require('../controllers/loginController');
    app.post("/login", loginController.socialLoginCallback);
};