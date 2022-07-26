const { pool } = require("../../config/database");

async function getBookIndexInfo(userIdx, pdfIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getBookIndexInfoQuery = `
            SELECT userBookIdx FROM userbooks WHERE userIdx = ${userIdx} AND pdfIdx = ${pdfIdx};
                  `;
  
    const [getBookIndexInfoRows] = await connection.query(
        getBookIndexInfoQuery
    );
    connection.release();
    return getBookIndexInfoRows;
}

async function searchHighlightInfo(bookIdx, keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchHighlightInfoQuery = `
    SELECT *
    FROM highlights
    WHERE userBookIdx = ?
      AND replace(data, ' ', '') LIKE concat('%', replace(?, ' ', ''), '%') AND active = 1;
                  `;
  
    const [searchHighlightInfoRows] = await connection.query(
        searchHighlightInfoQuery,
        [bookIdx, keyword]
    );
    connection.release();
    return searchHighlightInfoRows;
}

async function searchBookInfo(userIdx, keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchHighlightInfoQuery = `
    SELECT *
    FROM pdfs
    WHERE (replace(pdfName, ' ', '') LIKE concat('%', replace(?, ' ', ''), '%')
    OR replace(author, ' ', '') LIKE concat('%', replace(?, ' ', ''), '%')
    OR replace(subTitle, ' ', '') LIKE concat('%', replace(?, ' ', ''), '%'));
                  `;
  
    const [searchHighlightInfoRows] = await connection.query(
        searchHighlightInfoQuery,
        [keyword, keyword, keyword]
    );
    connection.release();
    return searchHighlightInfoRows;
}

module.exports = {
    getBookIndexInfo,
    searchHighlightInfo,
    searchBookInfo,
}