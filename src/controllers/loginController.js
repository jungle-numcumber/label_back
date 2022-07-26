// const loginModel = require('../model/loginModel');
const axios = require('axios');
const loginModel = require('../model/loginModel');
const crypto = require('crypto');
const loginController = require('../controllers/loginController');
const google = require('googleapis');


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
    // .get(
    // `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    // ;
    //     headers: {
    //     Authorization: `Bearer ${tokens.id_token}`,
    //     },
    // },
    // )
    .get(`https://www.googleapis.com/oauth2/v3/userinfo?&access_token=${tokens}`)
    .then(res => res.data)
    .catch(error => {
    throw new Error(error.message);
    });
    
    return googleUser;
}

let GrassZeros = ""
for (let i = 0, n = 364; i < n ; i += 1) {
    GrassZeros += "0"
}


async function socialLogin(email, name, picture, locale){
    console.log("login 함수가 실행됩니다.");
    let row = await loginModel.FindUserInfo(email);
    console.log('row:', row);
    /* 유저가 존재하면 row is not Null*/
    if (row.length > 0) {
    } else {
        const param = {
            userEmail: email,
            userName: name,
            userPhoto: picture,
            userLocale: locale,
            socialType: 1, 
            commitGrass: `${GrassZeros}`
        }
        console.log('param:', param);

        let insertRow = await loginModel.InsertUserInfo(param);
        row = await loginModel.FindUserInfo(id);
    }
    console.log('hello', row);
    return row;
}

// export.clearSession = async function (req, res) {
    
// }
exports.socialLoginCallback = async function (req, res) {
    // res.redirect(url);
    try {
        const googleUser = await googleLogin(req.body.tokens);
        console.log('googleUser:',googleUser);
        let userIdx = await socialLogin(googleUser.email, googleUser.name, googleUser.picture, googleUser.locale);
        console.log("success login");
        const sessionID = Math.random().toString(36).substring(2, 11);
        console.log("userIdx :", userIdx);
        req.session.userId = userIdx[0].userIdx;
        req.session.is_logined = true;
        
        loginModel.InsertSession(sessionID, userIdx);// session을 메모리로 넣어주는 과정. 


        return res.json({
            result: userIdx,
            isSuccess: true,
            code: 1000,
            message: "유저 구글 로그인 성공",
        })

    } catch (err) {
        console.log(`App - get login error\n: ${JSON.stringify(err)}`);
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "유저 구글 로그인 실패",
        });
    }
}

// exports.socialLogin = async function (email, name, picture, local){
//     console.log("login 함수가 실행됩니다.");
//     let row = await loginModel.FindUserInfo(email);
//     console.log(row);
//     /* 유저가 존재하면 row is not Null*/
//     if (row.length > 0) {
//     } else {
//         const param = {
//             userEmail: email,
//             userName: name,
//             userPicture: picture,
//             userLocal: local,
//             socialType: 1, 
//             commitGrass: ('0'*364)
//         }
//         let insertRow = await loginModel.InsertUserInfo(param);
//         row = await loginModel.FindUserInfo(email);
//     }
//     console.log(row);
//     return row;
// }

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

exports.authTest = async function (res, req) {
    
}
exports.userAuthorize = async function (res,req,sessionID) {
    let sessionIDIsExist = await loginModel.FindSession(sessionID);
    console.log('sessionIDIsExist:', sessionIDIsExist);
    if (sessionIDIsExist.length !== 0) {
        console.log("true");
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "유저 인가 완료",
        });
    } else {
        console.log("false");
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "유저 인가 실패",
        });
    }
}

exports.userSessionClear = async function (sessionID) {
    const sessionIDIsExist = loginModel.FindSession(sessionID);
    if (sessionIDIsExist) {
        loginModel.ClearSession(sessionID);
    }
}


exports.getUserInfo = async function(req, res) { 
    try {
      const userIdx = req.params.userIdx;
      const getUserInfoRows = await memoModel.getUserInfo(userIdx);
  
      return res.json({
        result: getUserInfoRows, 
        isSuccess : true, 
        code : 1000, 
        message: "user 정보 조회 성공", 
      })
    } catch (err) { 
      console.log(`App - get user info Query error\n: ${JSON.stringify(err)}`);
      return res.json({
        isSuccess: false, 
        code: 2000, 
        message: "user 정보 조회 실패",
      });
    }
  };