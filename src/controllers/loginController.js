// const loginModel = require('../model/loginModel');
const axios = require('axios');
const loginModel = require('../model/loginModel');
const crypto = require('crypto');
const loginController = require('../controllers/loginController');
const google = require('googleapis');

// const inSession = await loginModel.checkSession(userIdx)
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

// exports.getUserId = async function (req, res){
//     if (req.session.)
// }
///////////// 




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
    console.log("social login 함수가 실행됩니다.");
    let row = await loginModel.findUserInfo(email);
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

        const insertRow = await loginModel.insertUserInfo(param);
        row = await loginModel.findUserInfo(email);
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
        const [userInfo] = await socialLogin(googleUser.email, googleUser.name, googleUser.picture, googleUser.locale);
        const userIdx = userInfo.userIdx
        const inSession = await loginModel.checkSession(userIdx)
        let sessionID;
        console.log("inSession :", inSession);
        if (!inSession) {
            console.log("userInfo :", userInfo);
            console.log("success login");
            sessionID = Math.random().toString(36).substring(2, 11);
            console.log("userIdx :", userIdx);
            const sessionInfoRow = loginModel.insertSession(sessionID, userIdx);
        } 
        // req.session.userId = userIdx;
        // req.session.is_logined = true;
        console.log(req.session)


        return res.json({
            result: sessionID,
            isSuccess: true,
            code: 1000,
            message: "유저 구글 로그인 성공",
        })

    } catch (err) {
        console.log(`App - google login error\n: ${JSON.stringify(err)}`);
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
//         let insertRow = await loginModel.insertUserInfo(param);
//         row = await loginModel.FindUserInfo(email);
//     }
//     console.log(row);
//     return row;
// }



// exports.logout = async function (req, res){
//     console.log("logout 함수가 실행됩니다.");
//     req.session.destroy();
//     res.clearCookie('sid');
//     res.send('logout');
//     res.resdirect("/login");
// },

exports.logout = async function (req, res){
    console.log("header :", req)
    try { 
        console.log("logout 함수가 실행됩니다.");
        const sessionID = req.body.param
        console.log(sessionID);
        // const userIdx = req.params.userIdx;
        const [userIdx] = await loginModel.getUserIdxWithSessionID(sessionID);
        console.log(userIdx.userIdx);
        const deleteuserSessionRows = await loginModel.destroyDbSession(userIdx.userIdx);
        // console.log("req :", req.session);
        // req.session.destroy();
        // console.log("req :", req.session);
        // res.clearCookie('sid');
        // console.log("req :", res.clearCookie);
        // res.send('logout');
        // console.log("req :", res.send);
        // res.redirect("/");
    
        return res.json({
            isSuccess: true, 
            code: 1000, 
            message: "로그아웃 성공",
        })
    }catch(err) {
        console.log(`App - logout Query error\n: ${JSON.stringify(err)}`);
    
        return res.json({
            isSuccess: false, 
            code: 2000, 
            message: "로그아웃 실패",
        })
    }
}


exports.signup = async function (req, res){
    console.log("signup 함수가 실행됩니다.");
    const {userName, userEmail, userPW } = req.body;
    const defaultUserPhoto = "https://label-book-storage.s3.ap-northeast-2.amazonaws.com/default_profile.png";
    const salt = Math.round((4869 * Math.random())) + "";
    const hashedPW = crypto.createHash("sha512").update(userPW  + salt).digest("hex");
    let row = await loginModel.findUserInfo(userEmail);
    console.log('row:', row);
    /* 유저가 존재하면 row is not Null*/
    if (row.length > 0) {
        console.log(`App - signup Query error`);
    
        return res.json({
            isSuccess: false, 
            code: 2000, 
            message: "회원가입 실패",
        })
    } else {
        const param = {
            userName : userName,
            userEmail : userEmail,
            hashedPW : hashedPW,
            salt : salt,
            userPhoto : `${defaultUserPhoto}`,
            commitGrass: `${GrassZeros}`
        }
        const insertRow = await loginModel.insertUserInfo(param);
        console.log("userInfo :", param);
        [row] = await loginModel.findUserInfo(param.userEmail);
    }
    console.log("row :", row);

    const sessionID = Math.random().toString(36).substring(2, 11);
    console.log("userIdx :", row.userIdx);
    const sessionInfoRow = loginModel.insertSession(sessionID, row.userIdx);
        
    return res.json({
        result: sessionID,
        isSuccess: true, 
        code: 1000, 
        message: "회원가입 성공",
    })
}

exports.login = async function (req, res){
    console.log("login 함수가 실행됩니다.");
    const {userEmail, userPW} = req.body;
    try {
        const [userInfo] = await loginModel.findUserInfo(userEmail);
        const dbHashedPW = userInfo.hashedPW;
        const dbuserIdx = userInfo.userIdx;
        const dbSalt = userInfo.salt;
        const hashedPW = crypto.createHash("sha512").update(userPW + dbSalt).digest("hex");
        if (dbHashedPW === hashedPW) {
            console.log("success login");
            const sessionID = Math.random().toString(36).substring(2, 11);
            const sessionInfoRow = loginModel.insertSession(sessionID, dbuserIdx);
            // req.session.userId = body.userId;
            // req.session.is_logined = true;
            // res.send('success login');
            return res.json({
                result : sessionID,
                isSuccess: true, 
                code: 1000, 
                message: "로그인 성공",
            })
        } else {
            return res.json({
                isSuccess: false, 
                code: 2000, 
                message: "로그인 실패",
        })
    }
    } catch{
        return res.json({
            isSuccess: false, 
            code: 2000, 
            message: "로그인 실패",
    })
}
}
    



exports.authTest = async function (res, req) {}


exports.userAuthorize = async function (res,req,sessionID) {
    let sessionIDIsExist = await loginModel.findSession(sessionID);
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
    const sessionIDIsExist = loginModel.findSession(sessionID);
    if (sessionIDIsExist) {
        loginModel.ClearSession(sessionID);
    }
}


exports.getUserInfo = async function(req, res) { 
    try {
      const userIdx = req.params.userIdx;
      const getUserInfoRows = await loginModel.getUserInfo(userIdx);
  
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