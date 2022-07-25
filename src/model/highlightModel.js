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

async function getHighlightInfo(bookIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
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
        WHERE userBookIdx = ${bookIdx};
                  `;
  
    const [getHighlightInfoRows] = await connection.query(
        getHighlightInfoQuery
    );
    connection.release();
    return getHighlightInfoRows;
}

async function postHighlightInfo(bookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postHighlightInfoQuery = `
            INSERT INTO highlights(userBookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data, active)
            VALUES (${bookIdx}, ${pageNum}, '${startLine}', ${startOffset}, ${startNode}, '${endLine}', ${endOffset}, ${endNode}, '${data}',  '${active});
                  `;
  
    const [postHighlightInfoRows] = await connection.query(
        postHighlightInfoQuery
    );
    connection.release();
    return postHighlightInfoRows;
}

async function getHighlightPageInfo(bookIdx, pageNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getBookIndexInfoQuery = `
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
        WHERE userBookIdx = ${bookIdx} AND pageNum = ${pageNum};
                  `;
  
    const [getBookIndexInfoRows] = await connection.query(
        getBookIndexInfoQuery
    );
    console.log(getBookIndexInfoRows);
    connection.release();
    return getBookIndexInfoRows;
}


// delete를 위한 model이지만, put을 이용해서 active를 꺼준다. 
async function deleteHighlightInfo(highlightIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteHighlightInfoQuery = `
        UPDATE highlights
        SET active = 0
        WHERE highlightIdx = ${highlightIdx};
            `;
    const [deleteHighlightInfoRows] = await connection.query(
        deleteHighlightInfoQuery
    );
    connection.release();
    return deleteHighlightInfoRows;
}

module.exports = {
    getBookIndexInfo,
    getHighlightInfo,
    postHighlightInfo,
    getHighlightPageInfo,
    deleteHighlightInfo
}