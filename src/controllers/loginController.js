// const loginModel = require('../model/loginModel');
const axios = require('axios');
const loginModel = require('../model/loginModel');
const crypto = require('crypto');
const loginController = require('../controllers/loginController');
const google = require('googleapis');
var googleClient = require('../../config/google.json');

const googleConfig = {
    clientId: googleClient.web.client_id,
    clientSecret: googleClient.web.client_secret,
    redirect: googleClient.web.redirect_uris[0]
};

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

const oauth2Client = new google.Auth.OAuth2Client(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
);

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

// login
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
}

async function googleLogin(tokens) {

    // Fetch the user's profile with the access token and bearer
    console.log(tokens);
    const googleUser = await axios
    .get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    {
        headers: {
        Authorization: `Bearer ${tokens.id_token}`,
        },
    },
    )
    .then(res => res.data)
    .catch(error => {
    throw new Error(error.message);
    });

    return googleUser;
}

exports.socialLoginCallback = async function (req, res) {
    // res.redirect(url);
    const googleUser = await googleLogin(req.tokens);
    const userIdx = await socialLogin(googleUser.email, googleUser.name);
    console.log("success login");
    req.session.userId = userIdx;
    req.session.is_logined = true;
    res.send(userIdx);
}

exports.socialLogin = async function (id, name){
    console.log("login 함수가 실행됩니다.");

    let row = await loginModel.FindUserInfo(id);
    console.log(row);
    /* 유저가 존재하면 row is not Null*/
    if (row.length > 0) {
    } else {
        const param = {
            userEmail: id,
            userName: name
        }

        let insertRow = await loginModel.InsertUserInfo(param);
        row = await loginModel.FindUserInfo(id);
    }
    return row[0].userIdx;
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


