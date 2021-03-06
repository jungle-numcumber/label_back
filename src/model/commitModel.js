const { pool } = require("../../config/database");



//특정 user의 commit을 다 가져오는 경우
async function getUserCommitInfo(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getCommitInfoQuery = `
      SELECT commitIdx, 
      userIdx,
      userBookIdx,
      commitMessage, 
      logs, 
      createdAt, 
      updatedAt
    FROM commits
    WHERE userIdx = ${userIdx};
  `;
  // AND commitIdx = ${commitIdx}; 
  const [getCommitInfoRows] = await connection.query(
    getCommitInfoQuery
  );
  connection.release();
  return getCommitInfoRows;
}


//특정 user, 특정 Book의 commit을 다 가져오는 경우
async function getBookCommitInfo(userBookIdx) {
  console.log(userBookIdx);
  const connection = await pool.getConnection(async (conn) => conn);
  const getCommitInfoQuery = `
      SELECT commitIdx, 
      userIdx,
      userBookIdx,
      commitMessage, 
      logs, 
      createdAt, 
      updatedAt
    FROM commits
    WHERE userBookIdx = ${userBookIdx};
  `;
  // AND commitIdx = ${commitIdx}; 
  const [getCommitInfoRows] = await connection.query(
    getCommitInfoQuery
  );
  connection.release();
  return getCommitInfoRows;
}



//logs : 추후에 수정해줄 예정
async function postCommitInfo(userIdx, userBookIdx, commitMessage, logs) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postCommitInfoQuery = `
    INSERT INTO commits(userIdx, userBookIdx, commitMessage, logs)
    VALUES (${userIdx}, ${userBookIdx}, '${commitMessage}', '${logs}')
  `;
  const [postCommitInfoRows] = await connection.query(
    postCommitInfoQuery
  );
  connection.release();
  return postCommitInfoRows;
}


// 링크에 접속하고자 하는 사람과, commit 작성 하는 사람이 같음을 인증하는 과정이 추가적으로 필요하다. 
async function putCommitInfo(commitIdx, commitMessage) {
  const connection = await pool.getConnection(async (conn) => conn);
  const putCommitInfoQuery = `
    UPDATE commits
    SET commitMessage = '${commitMessage}'
    WHERE commitIdx = ${commitIdx};
  `;
  const [putCommitInfoRows] = await connection.query(
    putCommitInfoQuery
  );
  connection.release();
  return putCommitInfoRows;
}


async function deleteCommitInfo(commitIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteCommitInfoQuery = `
    DELETE FROM commits WHERE commitIdx = ${commitIdx};
  `;
  const [deleteCommitInfoRows] = await connection.query(
    deleteCommitInfoQuery
  );
  connection.release();
  return deleteCommitInfoRows;
}


module.exports = {
  getUserCommitInfo,
  getBookCommitInfo,  
  postCommitInfo, 
  putCommitInfo,
  deleteCommitInfo 
}