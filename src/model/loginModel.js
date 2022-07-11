const { pool } = require("../../config/database");

async function InsertUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  var paramParsed = {
    userId : param.userId,
    userPwd : param.userPwd,
    salt: param.salt
  }
  console.log(paramParsed.userId, param.userId);
  const insertUserInfoQuery = `
              INSERT INTO USER (userId, userPwd, salt) VALUES ('${paramParsed.userId}', '${paramParsed.userPwd}', '${paramParsed.salt}')
              `;
  const [insertUserInfoRows] = await connection.query(insertUserInfoQuery);
  connection.release();
  console.log("Insert finish");
  return insertUserInfoRows;
}

async function FindUserInfo(param) {
  const connection = await pool.getConnection(async (conn) => conn);
  const findUserInfoQuery = `
              Select * FROM USER WHERE userId = '${param}'
              `;
  const [findUserInfoRows] = await connection.query(findUserInfoQuery);
  console.log('Select User finish',findUserInfoRows);
  connection.release();
  return findUserInfoRows;
}

module.exports = {
    InsertUserInfo,
    FindUserInfo
}
