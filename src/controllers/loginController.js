const loginModel = require('../model/loginModel');
const crypto = require('crypto');

// login
// 여기부터 수정 *****

    // redirect: async function (req, res){
    //     if (req.session.user) {
    //         // 세션에 유저가 존재한다면
    //         res.redirect("example.html");
    //     } else {
    //         res.redirect("/login.html")
    //     }
    // },
// 궁금한 부분: 
// 1. 시간이 지나면 세션기록 지워져야햐나? 사용자가 로그아웃 하지않으면 세션 계속남아있는거 처리 어떻게?
// 2. 이미 로그인했는데 로그인 페이지 접속하려하면?
// 3. 이미 로그아웃했는데 로그인 페이지 제외 다른 페이지 접속하려하면?

exports.checkLoginState = async function (req, res){
    if (req.session.is_logined) {
        // res.redirect("example.html");
    } else {
        res.redirect("/login.html")
    }
},

exports.login = async function (req, res){
    console.log("login 함수가 실행됩니다.");
    let body = req.body;
    var param = body.userId
    var row = await loginModel.FindUserInfo(param);
    console.log(row);
    let dbPassword = row[0].userPwd;
    let inputPassword = body.userPwd;
    let salt = row[0].salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if (dbPassword === hashPassword) {
        console.log("success login");
        req.session.userId = body.userId;
        req.session.is_logined = true;
        res.send('success login');
    } else {
        console.log("fail login");
        res.send('fail login');
    }
},

exports.logout = async function (req, res){
    console.log("logout 함수가 실행됩니다.");
    req.session.destroy();
    res.clearCookie('sid');
    res.send('logout');
    res.resdirect("/login");
},

exports.signup = async function (req, res){
    var body = req.body;
    var inputPassword = body.userPwd;
    var salt = Math.round((4869 * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    console.log(body);

    var param = {
        userId : body.userId,
        userPwd : hashPassword,
        salt : salt,
    }
    var rows = await loginModel.InsertUserInfo(param);
    await res.json(rows);
}
