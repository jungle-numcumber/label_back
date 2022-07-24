const { pool } = require("../../config/database");

async function postUploadInfo(totalPage, firstPageLink, pdfName, subTitle, author, userIdx, pdfIdx) {
  console.log(1)
  const connection = await pool.getConnection(async (conn) => conn);
  const postUploadInfoQuery = `
    INSERT INTO pdfs(totalPage, firstPageLink, pdfName, subTitle, author)
    VALUES (${totalPage}, '${firstPageLink}', '${pdfName}', '${subTitle}', '${author}');
  `;
  const postUserBookInfoQuery = `
    INSERT INTO userbooks(userIdx, pdfIdx)
    VALUES (${userIdx}, ${pdfIdx});
  `
  const postUploadInfoRows = await connection.query(
    postUploadInfoQuery
  );

  const postUserBookInfoRows = await connection.query(
    postUserBookInfoQuery
  );
  connection.release();
  return postUploadInfoRows, postUserBookInfoRows;
}

async function postUploadPageInfo(pdfIdx, pageNum, pageLink) {
  console.log(2)
  const connection = await pool.getConnection(async (conn) => conn);
  const postUploadPageInfoQuery = `
    INSERT INTO bookpages(pdfIdx, pageNum, pageLink)
    VALUES (${pdfIdx}, ${pageNum}, '${pageLink}');
  `;
  const postUploadPageInfoRows = await connection.query(
    postUploadPageInfoQuery
  );
  connection.release();
  return postUploadPageInfoRows;
}


module.exports = {
  postUploadInfo,
  postUploadPageInfo
}

// VALUES (?,?,?);
// [pdfIdx, pageNum, pageHtml]
// VALUES (${pdfIdx}, ${pageNum}, '${pageHtml}');