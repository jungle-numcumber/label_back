const { pool } = require("../../config/database");

// 특정 user, 특정 book, 특정 highlight 의 memo를 다 가져오는 경우
async function getHighlightMemoInfo(highlightIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getMemoInfoQuery = `
      SELECT memoIdx, 
      userBookIdx,
      highlightIdx,
      data, 
      createdAt, 
      updatedAt
    FROM memos
    WHERE highlightIdx = ${highlightIdx};
  `;
  const [getHighlightMemoInfoRows] = await connection.query(
    getMemoInfoQuery
  );
  connection.release();
  // console.log(getHighlightMemoInfoRows);
  return getHighlightMemoInfoRows;
}

// highlightIdx를 기준으로 memo 추가 
async function postMemoInfo(userBookIdx, highlightIdx, data) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postMemoInfoQuery = `
    INSERT INTO memos(userBookIdx, highlightIdx, data)
    VALUES (${userBookIdx}, ${highlightIdx}, '${data}')
  `;
  const [postMemoInfoRows] = await connection.query(
    postMemoInfoQuery
  );
  connection.release();
  return postMemoInfoRows;
}

// 링크에 접속하고자 하는 사람과, commit 작성 하는 사람이 같음을 인증하는 과정이 추가적으로 필요하다. 
async function putMemoInfo(memoIdx, data) {
  const connection = await pool.getConnection(async (conn) => conn);
  const putMemoInfoQuery = `
    UPDATE memos
    SET data = '${data}'
    WHERE memoIdx = ${memoIdx};
  `;
  const [putMemoInfoRows] = await connection.query(
    putMemoInfoQuery
  );
  connection.release();
  return putMemoInfoRows;
}


async function deleteMemoInfo(memoIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteMemoInfoQuery = `
    DELETE FROM memos WHERE memoIdx = ${memoIdx};
  `;
  const [deleteMemoInfoRows] = await connection.query(
    deleteMemoInfoQuery
  );
  connection.release();
  return deleteMemoInfoRows;
}



module.exports = {
  // getUserCommitInfo,
  getHighlightMemoInfo,  
  postMemoInfo, 
  putMemoInfo,
  deleteMemoInfo 
}