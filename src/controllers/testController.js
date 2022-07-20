// const testModel = require('../model/testModel');

exports.first = async function (req, res) {
   return res.json(200);
};

// exports.getTest = async function (req, res) {

//     try {
//         const [getUserProfileInfoRows] = await testModel.getTests();

//         return res.json({
//             result: getUserProfileInfoRows,
//             isSuccess: true,
//             code: 1000,
//             message: "프로필 정보 조회 성공",
//         })

//     } catch (err) {
//         console.log(`App - get user info Query error\n: ${JSON.stringify(err)}`);
        
//         return res.json({
//             isSuccess: false,
//             code: 2000,
//             message: "프로필 정보 조회 실패",
//         });
//     }
// };