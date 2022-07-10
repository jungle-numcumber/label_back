const { pool } = require("../../config/database");

async function getTests() {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteUserInfoQuery = `
                  SELECT * FROM user WHERE id = 6;
                  `;
  
    const [deleteUserInfoRows] = await connection.query(
      deleteUserInfoQuery
    );
    console.log(deleteUserInfoRows);
    connection.release();
    return deleteUserInfoRows;
}



module.exports = {
    getTests
}