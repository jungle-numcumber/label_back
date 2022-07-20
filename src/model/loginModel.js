// const { pool } = require("../../config/database");

// async function getUserInfo(userIdx) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const getUserInfoQuery = `
//             SELECT userIdx FROM users WHERE userIdx = ${userIdx};
//                   `;
  
//     const [getUserInfoRows] = await connection.query(
//         getUserInfoQuery
//     );
//     connection.release();
//     return getUserInfoRows;
// }

// async function getTokenMatch() {
//     return ;
// }

const { pool } = require("../../config/database");

async function InsertUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);

  const insertUserInfoQuery = `
              INSERT INTO users (userEmail, userName) VALUES ('${param.userEmail}', '${param.userName}')
              `;
  const [insertUserInfoRows] = await connection.query(insertUserInfoQuery);
  connection.release();
  return insertUserInfoRows;
}

async function FindUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const findUserInfoQuery = `
              Select * FROM users WHERE userIdx = '${param}'
              `;
  const [findUserInfoRows] = await connection.query(findUserInfoQuery);
  connection.release();
  return findUserInfoRows;
}

module.exports = {
    InsertUserInfo,
    FindUserInfo
}
