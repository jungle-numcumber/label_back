const res = require("express/lib/response");
const { pool } = require("../../config/database");
const Client = require('mongodb').MongoClient;
const mongoUrl = require('../../config/database').mongoUrl;
// var mongoUrl = 'mongodb://newcumber:newcumber@localhost:27017'
//특정 user의 commit을 다 가져오는 경우
async function getUserCommitInfo(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getCommitInfoQuery = `
      SELECT commitIdx, 
      userIdx,
      userBookIdx,
      commitMessage, 
      logs, 
      createdAt 
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



async function getDailyCommitInfo(userIdx, dateInfo) {
  const connection = await pool.getConnection(async (conn) => conn);
  console.log("date", dateInfo)
  const getDailyCommitInfoQuery = `
    SELECT bookName, commitMessage, createdAt
    FROM commits
    WHERE userIdx = ${userIdx} AND DATE_FORMAT(createdAt, '%Y-%m-%d') = '${dateInfo}';
  `;
  const [getDailyCommitInfoRows] = await connection.query(
    getDailyCommitInfoQuery
  );
  connection.release();
  return getDailyCommitInfoRows;
}


//특정 user, 특정 Book의 commit을 다 가져오는 경우
async function getBookCommitInfo(userIdx, userBookIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getCommitInfoQuery = `
      SELECT commitIdx, 
      userIdx,
      userBookIdx,
      commitMessage, 
      logs, 
      createdAt, 
      editorLog
    FROM commits
    WHERE userBookIdx = ${userBookIdx}
    AND userIdx = ${userIdx}
  `;

  const [getCommitInfoRows] = await connection.query(
    getCommitInfoQuery
  );

  connection.release();
  return getCommitInfoRows;
}





//특정 user, 특정 Book의 commit을 다 가져오는 경우
async function getBookCommitInfoWithIdx(userCommitIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getCommitInfoQuery = `
      SELECT commitIdx, 
      userIdx,
      userBookIdx,
      commitMessage, 
      logs, 
      createdAt, 
      editorLog
    FROM commits
    WHERE commitIdx = ${userCommitIdx}
  `;

  const [getCommitInfoRows] = await connection.query(
    getCommitInfoQuery
  );

  connection.release();
  return getCommitInfoRows;
}


//logs : 추후에 수정해줄 예정
async function postCommitInfo(userIdx, userBookIdx, commitMessage, logs, editorLog, bookName) {
  const connection = await pool.getConnection(async (conn) => conn);

  // const parsedDate = MOMENT.defaultFormat(createdAt);
  // const parsedDate2 = require('fecha').format(createdAt)
  // console.log('time', parsedDate, parsedDate2)
  const postCommitInfoQuery = `
    INSERT INTO commits(userIdx, userBookIdx, commitMessage, logs, editorLog, bookName)
    VALUES ('${userIdx}', '${userBookIdx}', '${commitMessage}', '${logs}', '${editorLog}', '${bookName}')
  `;
  const [postCommitInfoRows] = await connection.query(
    postCommitInfoQuery
  );
  connection.release();
  return postCommitInfoRows;
}

async function putRollbackHighlightReset(userBookIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const putRollbackHighlightResetQuery = `
    UPDATE highlights
    SET active = 0
    WHERE userBookIdx = ${userBookIdx};
  `;
  const [putRollbackHighlightResetRows] = await connection.query(
    putRollbackHighlightResetQuery
  );
  connection.release();
  return putRollbackHighlightResetRows
}

async function putRollbackHighlight(commitHighlightLogParsed) {
  const connection = await pool.getConnection(async (conn) => conn);
  const putRollbackHighlightQuery = `
    UPDATE highlights
    SET active = 1
    WHERE highlightIdx IN (${commitHighlightLogParsed});
  `;
  const [putRollbackHighlightRows] = await connection.query(
    putRollbackHighlightQuery
  );
  connection.release();
  return putRollbackHighlightRows
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


async function deleteCommitInfo(userIdx, userBookIdx, createdAt) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteCommitInfoQuery = `
    DELETE FROM commits WHERE userIdx = ${userIdx} AND userBookIdx = ${userBookIdx} AND createdAt = ${createdAt};
  `;
  const [deleteCommitInfoRows] = await connection.query(
    deleteCommitInfoQuery
  );
  connection.release();
  return deleteCommitInfoRows;
}

async function externalDBConnect(userIdx, pdfIdx) {
  console.log("userIdx :", userIdx);
  console.log("pdfIdx :", pdfIdx);

  console.log("externalDBConnect i");
  try {
  let conn = await Client.connect(mongoUrl);
  let db = conn.db('editors');
  let result = await db.collection('editor').findOne({id: userIdx, pdfId: pdfIdx});
  console.log("text :", result['text']);
  await conn.close();
  return result['text'];
  } catch (err){
    console.log('error in externalDB: ', err);
    return res.send("err");
  }
}

module.exports = {
  getUserCommitInfo,
  getBookCommitInfo,  
  postCommitInfo, 
  putCommitInfo,
  deleteCommitInfo,
  getBookCommitInfoWithIdx,
  externalDBConnect, 
  getDailyCommitInfo,
  putRollbackHighlightReset,
  putRollbackHighlight
}