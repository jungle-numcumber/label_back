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

async function insertUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);

  const insertUserInfoQuery = `
              INSERT INTO users (userEmail, userName, userPhoto, userLocale, socialType, commitGrass) VALUES ('${param.userEmail}', '${param.userName}', '${param.userPhoto}', '${param.userLocale}', '${param.socialType}', '${param.commitGrass}')
              `;
  const [insertUserInfoRows] = await connection.query(insertUserInfoQuery);
  connection.release();
  return insertUserInfoRows;
}

async function findUserInfo(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const findUserInfoQuery = `
              SELECT * FROM users WHERE userEmail = '${email}'
              `;
  const [findUserInfoRows] = await connection.query(findUserInfoQuery);
  connection.release();
  return findUserInfoRows;
}

async function insertSession (sessionID, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const  insertSessionQuery= `
              INSERT INTO sessions (sessionID, userIdx) VALUES ('${sessionID}', '${userIdx}')
              `;  
  const [insertSessionInfoRows] = await connection.query(insertSessionQuery);
  connection.release();
  return insertSessionInfoRows;
}

async function getUserInfo(userIdx) {
  userIdx = 37
  const connection = await pool.getConnection(async (conn) => conn);
  
  const getUserInfoQuery = `
      SELECT * FROM users WHERE userIdx = '${userIdx}';
  `;
  const [getUserInfoRows] = await connection.query(
    getUserInfoQuery
  );
  connection.release();
  return getUserInfoRows;
}



module.exports = {
    insertUserInfo,
    findUserInfo, 
    insertSession,
    getUserInfo
}
