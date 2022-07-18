module.exports = function(app){
    const loginController = require('../controllers/loginController');
    app.get("/login", loginController.socialLoginCallback);
};