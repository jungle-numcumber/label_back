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

async function FindUserInfoTest() {
  const connection = await pool.getConnection(async (conn) => conn);
  const findUserInfoQuery = `
              Select * FROM users
              `;
  const [findUserInfoRows] = await connection.query(findUserInfoQuery);
  connection.release();
  return findUserInfoRows;
}

async function FindUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const findUserInfoQuery = `
              Select * FROM users WHERE userEmail = '${param}'
              `;
  const [findUserInfoRows] = await connection.query(findUserInfoQuery);
  connection.release();
  return findUserInfoRows;
}

async function FindSession(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const findSessionQuery = `
              Select * FROM sessions WHERE sessionID = '${param}'
              `
  const [findSessionRows] = await connection.query(findSessionQuery);
  connection.release();
  console.log(findSessionRows);
  return findSessionRows;
}

async function ClearSession(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const clearSessionQuery = `
              Delete FROM sessions WHERE sessionID = '${param}'
              `;
  const [clearSessionRows] = await connection.query(clearSessionQuery);
  connection.release();
  return clearSessionRows;
}

async function InsertSession(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertSessionQuery = `
              INSERT INTO sessions (sessionID) VALUES ('${param}')
              `;
  const [insertSessionRows] = await connection.query(insertSessionQuery);
  connection.release();
  return insertSessionRows;
}

module.exports = {
  InsertUserInfo,
  FindUserInfo,
  FindSession,
  ClearSession,
  InsertSession
}
