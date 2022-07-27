// module.exports = function(app){
//     const loginController = require('../controllers/loginController');
//     app.get("/login", loginController.socialLoginCallback);
// }; 


module.exports = function (app) {
    const loginController = require("../controllers/loginController");
    app.get("/userInfo", loginController.getUserInfo);
    app.post("/auth/test", (req, res) => {
      console.log(req.body.forauthorization);
      loginController.userAuthorize(res,req,req.body.forauthorization);
    });
    app.post("/signup", loginController.signup);
    app.post("/socialLogin", loginController.socialLoginCallback);
    app.post("/login", loginController.login);
    app.post("/logout", loginController.logout);
    // app.post("/logout", async function (req, res) {
    //     var session = req.session;
    //     try {
    //         if (session.is_logined) {
    //             //세션정보가 존재하는 경우
    //             // await req.session.destroy(function (err) {
    //             //     if (err) console.log(err);
    //             //     else {
    //             //         // res.clearCookie()
                        
    //             //     }
    //             // });
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     // res.redirect("/");
    // }
    // );
};