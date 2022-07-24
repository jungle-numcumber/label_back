const { contentType } = require("express/lib/response");
const { pool } = require("../../config/database");

async function getPageHighlightMemoInfo(bookIdx, pageNum) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getPageHighlightIndexQuery = `
      SELECT highlightIdx
      FROM highlights
      WHERE userBookIdx = ${bookIdx} AND pageNum = ${pageNum};
                `;
  const [getPageHighlightIndexRows] = await connection.query(
    getPageHighlightIndexQuery
  );

  const pageHighlightIndex = []
  getPageHighlightIndexRows.forEach((idx) => {
    pageHighlightIndex.push(idx.highlightIdx)
  });

  const getHighlightInfoQuery = `
      SELECT highlightIdx,
      userBookIdx,
      pageNum,
      startLine,
      startOffset,
      startNode,
      endLine,
      endOffset,
      endNode,
      data,
      createdAt,
      updatedAt
  FROM highlights
  WHERE highlightIdx IN (${pageHighlightIndex});
  `;
  const getMemoInfoQuery = `
      SELECT memoIdx,
      userBookIdx,
      highlightIdx,
      data, 
      createdAt,
      updatedAt
  FROM memos
  WHERE highlightIdx IN (${pageHighlightIndex});
  `;
  const [getHighlightInfoRows] = await connection.query(
    getHighlightInfoQuery
  )
  const [getMemoInfoRows] = await connection.query(
    getMemoInfoQuery
  )

  console.log(getHighlightInfoRows);
  console.log(getMemoInfoRows)

  connection.release();
  return [getHighlightInfoRows, getMemoInfoRows];
}


module.exports = {
  getPageHighlightMemoInfo
}