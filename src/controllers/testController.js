const testModel = require('../model/testModel');

exports.first = async function (req, res) {
    console.log("GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다.");
    res.json({"message" : "GET 메소드를 사용하는 /test 라우팅 연결이 성공하였습니다."});
};

exports.getTest = async function (req, res) {

    try {
        const [getUserProfileInfoRows] = await testModel.getTests();

        return res.json({
            result: getUserProfileInfoRows,
            isSuccess: true,
            code: 1000,
            message: "프로필 정보 조회 성공",
        })

    } catch (err) {
        console.log(`App - get user info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "프로필 정보 조회 실패",
        });
    }
};