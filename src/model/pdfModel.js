const { pool } = require("../../config/database");

async function getPdfs(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserPdfInfoQuery = `
            SELECT p.pdfIdx, p.pdfName, p.subTitle, p.author, p.firstPageLink, p.totalPage 
            FROM userbooks
                    JOIN pdfs p on userbooks.pdfIdx = p.pdfIdx
            WHERE userbooks.userIdx = ${userId};
                  `;
  
    const [getUserPdfInfoRows] = await connection.query(
        getUserPdfInfoQuery
    );
    connection.release();
    return getUserPdfInfoRows;
}

async function getPdfPageHtml(pdfIdx, pageNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getPdfPageInfoQuery = `
            SELECT pdfIdx, pageNum, pageHtml FROM pdfpages WHERE pdfIdx = ${pdfIdx} AND pageNum = ${pageNum};
                  `;
  
    const [getPdfPageInfoRows] = await connection.query(
        getPdfPageInfoQuery
    );
    connection.release();
    return getPdfPageInfoRows;
}



module.exports = {
    getPdfs,
    getPdfPageHtml
}