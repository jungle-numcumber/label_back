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
            color, 
            createdAt,
            updatedAt
        FROM highlights
        WHERE userBookIdx = ${bookIdx} ;
                  `;
  
    const [getHighlightInfoRows] = await connection.query(
        getHighlightInfoQuery
    );
    connection.release();
    return getHighlightInfoRows;
}

async function getCurrentHighlight(userBookIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    // console.log(userBookIdx)
    const getHighlightInfoQuery = `
        SELECT *
        FROM highlights
        WHERE userBookIdx = ${userBookIdx}
        AND active = 1
        `;
  
    const [getHighlightInfoRows] = await connection.query(
        getHighlightInfoQuery
    );
    // console.log(getHighlightInfoRows)
    connection.release();
    return getHighlightInfoRows;
}

async function getLogHighlight(logs) {
    const connection = await pool.getConnection(async (conn) => conn);
    // console.log(userBookIdx)
    try{
        let logString = '('
        for(i = 0; i < logs.length; i++) {
            logString += "'"
            logString += String(logs[i]) 
            if (i === logs.length - 1) {
                logString += "'"
            } else {
                logString += "',"
            }
        }
        logString += ')';
        // console.log(logString)
        const getHighlightInfoQuery = `
            SELECT *
            FROM highlights
            WHERE highlightIdx IN ${logString}
            `;
      
        const [getHighlightInfoRows] = await connection.query(
            getHighlightInfoQuery
        );
        // console.log(getHighlightInfoRows)
        connection.release();
        return getHighlightInfoRows;

    } catch (err){
        console.log(`App - get pdf commit highlight info Query DB error\n: ${JSON.stringify(err)}`);
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "해당 PDF 하이라이트들 DB 조회 실패",
        });
    }
}

async function postHighlightInfo(bookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data, color) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postHighlightInfoQuery = `
            INSERT INTO highlights(userBookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data, color)
            VALUES (${bookIdx}, ${pageNum}, '${startLine}', ${startOffset}, ${startNode}, '${endLine}', ${endOffset}, ${endNode}, '${data}', '${color}');
            `;
  
    const [postHighlightInfoRows] = await connection.query(
        postHighlightInfoQuery
    );
    connection.release();
    return postHighlightInfoRows;
}

async function putHighlightInfo(bookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    const postHighlightInfoQuery = `
        UPDATE highlights
        SET commitMessage = '${commitMessage}'
        WHERE commitIdx = ${commitIdx};
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
            active, 
            color, 
            createdAt,
            updatedAt
        FROM highlights
        WHERE userBookIdx = ${bookIdx} AND pageNum = ${pageNum} AND active = 1;
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
    deleteHighlightInfo,
    putHighlightInfo,
    getCurrentHighlight,
    getLogHighlight
}