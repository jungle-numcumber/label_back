const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require("session-file-store")(session);
const upload = require('express-fileupload');


module.exports = function () {
    const app = express();

    // 미들웨어 압축, 파일 용량 줄임
    app.use(compression());
    app.use(express.json());
    // restful api 중 form으로 put, delete를 사용하기 위해 씀
    app.use(methodOverride());
    // urlencoded 페이로드로 들어오는 요청을 분석, extended true는 qs 모듈을 써서 body parsing
    app.use(express.urlencoded({extended: true}));
    // 모든 도메인에서 나의 서버에게 요청을 보낼 수 있게 해줌
    app.use(cors());
    app.use(upload());

    // cookie and session assign middleware
    app.use(cookieParser());

    // express session 연결
    app.use(
        session({
            secret: "cumbers secret key", // 암호화하는데 쓰일 키
            secure: true, // https 환경에서만 session 정보를 주고받도록 처리
            resave: true, // 세션을 언제나 저장할 지 설정
            saveUninitialized: true, // 세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
            cookie: { // 세션 쿠키 설정 (세션 관리 시 클라이언ㅇ트에 보내는 쿠키)
                httpOnly: true,
                secure: true
            },
            store: new fileStore()
        })
    );

    require('../src/routes/testRoute')(app);
    require('../src/routes/pdfRoute')(app);
    require('../src/routes/highlightRoute')(app);
    require('../src/routes/commitRoute')(app);
    require('../src/routes/memoRoute')(app);
    require('../src/routes/loginRoute')(app);
    require('../src/routes/editorRoute')(app);
    require('../src/routes/uploadRoute')(app);

    return app;
};
