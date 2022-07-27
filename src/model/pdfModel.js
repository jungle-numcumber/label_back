const { pool } = require("../../config/database");

async function getPdfPageLink(pdfIdx, pageNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getPdfPageInfoQuery = `
            SELECT pdfIdx, pageNum, pageLink FROM bookpages WHERE pdfIdx = ${pdfIdx} AND pageNum = ${pageNum};
                `;
    const [getPdfPageInfoRows] = await connection.query(
        getPdfPageInfoQuery
    );
    connection.release();
    return getPdfPageInfoRows;
}


async function getPdfAll(userIdx) {
    userIdx = 58;
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserPdfInfoQuery = `
            SELECT *
            FROM pdfs
            ORDER BY hits;
                  `;
  
    const [getUserPdfInfoRows] = await connection.query(
        getUserPdfInfoQuery
    );
    connection.release();
    return getUserPdfInfoRows;
}


async function getUserPdfs(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserPdfInfoQuery = `
            SELECT p.pdfIdx, p.pdfName, p.subTitle, p.author, p.firstPageLink, p.totalPage, recentlyReadPage, userbooks.updatedAt 
            FROM userbooks
                    JOIN pdfs p on userbooks.pdfIdx = p.pdfIdx
            WHERE userbooks.userIdx = ${userId}
            ORDER BY userbooks.updatedAt DESC;
                  `;
  
    const [getUserPdfInfoRows] = await connection.query(
        getUserPdfInfoQuery
    );
    connection.release();
    return getUserPdfInfoRows;
}

async function getPdfPageLink(pdfIdx, pageNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getPdfPageInfoQuery = `
            SELECT pdfIdx, pageNum, pageLink FROM bookpages WHERE pdfIdx = ${pdfIdx} AND pageNum = ${pageNum};
                `;
    const [getPdfPageInfoRows] = await connection.query(
        getPdfPageInfoQuery
    );
    connection.release();
    return getPdfPageInfoRows;
}

async function getLastPdfIdx() {
    const connection = await pool.getConnection(async (conn) => conn);
    const getLastPdfIdxQuery = `
        SELECT pdfIdx FROM pdfs ORDER BY pdfIdx DESC LIMIT 1;
                `;
  
    const [getLastPdfIdx] = await connection.query(
        getLastPdfIdxQuery
    );
    connection.release();
    // console.log("last :", getLastPdfIdx[0].pdfIdx)
    return getLastPdfIdx[0].pdfIdx;
}

async function putRecentlyReadPage(recentlyReadPage, userBookIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const putRecentlyReadPageQuery = `
        UPDATE userbooks
        SET recentlyReadPage = '${recentlyReadPage}'
        WHERE userBookIdx = '${userBookIdx}';
            `;
  
    const [putRecentlyReadPage] = await connection.query(
        putRecentlyReadPageQuery
    );
    connection.release();
    return putRecentlyReadPage;
}





module.exports = {
    getPdfAll, 
    getUserPdfs,
    getPdfPageLink, 
    getLastPdfIdx,
    putRecentlyReadPage
}