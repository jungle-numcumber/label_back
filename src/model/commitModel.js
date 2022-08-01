const res = require("express/lib/response");
const { pool } = require("../../config/database");
const Client = require('mongodb').MongoClient;
const mongoUrl = require('../../config/database').mongoUrl;

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
  externalDBConnect
}