const { pool } = require("../../config/database");

async function postPdfsInfo(totalPage, firstPageLink, pdfName, subTitle, author) {
  console.log(1)
  const connection = await pool.getConnection(async (conn) => conn);
  const postPdfsInfoQuery = `
    INSERT INTO pdfs(totalPage, firstPageLink, pdfName, subTitle, author)
    VALUES (${totalPage}, '${firstPageLink}', '${pdfName}', '${subTitle}', '${author}');
  `;
  const postPdfsInfoRows = await connection.query(
    postPdfsInfoQuery
  );
  connection.release();
  return postPdfsInfoRows ;
}


async function postUploadUserBookInfo(userIdx, pdfIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postUserBookInfoQuery = `
    INSERT INTO userbooks(userIdx, pdfIdx)
    VALUES (${userIdx}, ${pdfIdx});
  `
  const postUserBookInfoRows = await connection.query(
    postUserBookInfoQuery
  );
  connection.release();
  return postUserBookInfoRows;
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
  postPdfsInfo, 
  postUploadUserBookInfo, 
  postUploadPageInfo
}

// VALUES (?,?,?);
// [pdfIdx, pageNum, pageHtml]
// VALUES (${pdfIdx}, ${pageNum}, '${pageHtml}');