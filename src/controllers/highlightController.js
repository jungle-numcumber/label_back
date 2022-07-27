const highlightModel = require('../model/highlightModel');
const commitModel = require('../model/commitModel');


async function argCheck(temp) {
    if(typeof temp === 'undefined' || temp === null || temp === ''){
        return true;
    }
    else {
        return false;
    }
}

exports.getHighlight = async function (req, res) {
    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 58;
        const pdfIdx = req.params.pdfIdx;      
        const [bookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
        const getHighlightInfoRows = await highlightModel.getHighlightInfo(bookIdx.userBookIdx);
        
        return res.json({
            result: getHighlightInfoRows,
            isSuccess: true,
            code: 1000,
            message: "해당 PDF 하이라이트들 조회 성공",
        })

    } catch (err) {
        console.log(`App - get pdf highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "해당 PDF 하이라이트들 조회 실패",
        });
    }
};

exports.getCommitHighlight = async function (req, res) {
    try {
        // userIdx 동적으로 수정 예정
        // const userIdx = req.params.userIdx;
        // const pdfIdx = req.params.pdfIdx;
        const commitIdx = req.params.commitIdx;
        const page = req.params.pageNum;
        // console.log(commitIdx)
        // const [bookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
        const userCommit = await commitModel.getBookCommitInfoWithIdx(commitIdx);
        const logs = userCommit[0]['logs'];
        eval('var logObj='+logs);
        // console.log(page)
        const parsedLogs = logObj[page];
        // console.log(parsedLogs);
        const getHighlightInfoRows = await highlightModel.getLogHighlight(parsedLogs);
        
        return res.json({
            result: getHighlightInfoRows,
            isSuccess: true,
            code: 1000,
            message: "해당 PDF 하이라이트들 조회 성공",
        })

    } catch (err) {
        console.log(`App - get pdf highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "해당 PDF 하이라이트들 조회 실패",
        });
    }
};

exports.postHighlight = async function (req, res) {

    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 58;
        const {pdfIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data} = req.body;
        let checkPdf = await argCheck(pdfIdx);
        let checkPage = await argCheck(pageNum);
        let checkStartLine = await argCheck(startLine);
        let checkStartOff = await argCheck(startOffset);
        let checkStartNode = await argCheck(startNode);
        let checkEndLine = await argCheck(endLine);
        let checkEndOff = await argCheck(endOffset);
        let checkEndNode = await argCheck(endNode);
        let checkData = await argCheck(data);

        if (isNaN(pdfIdx) || isNaN(pageNum) || isNaN(startOffset) || isNaN(startNode) || isNaN(endOffset) || isNaN(endNode)) {
            return res.json({
                isSuccess: false,
                code: 2201,
                message: "int로 주어야 하는 body 인자를 제대로 확인하세요",
            })
        }
        
        if (checkPdf || checkPage || checkStartLine || checkStartOff || checkStartNode || checkEndLine || checkEndOff || checkEndNode || checkData) {
            return res.json({
                isSuccess: false,
                code: 2200,
                message: "body 인자를 제대로 입력하세요",
            })
        }
        const [bookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
        const postHighlightRows = await highlightModel.postHighlightInfo(bookIdx.userBookIdx, pageNum, startLine, startOffset, startNode, endLine, endOffset, endNode, data);
        
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "하이라이트 등록 성공",
        })

    } catch (err) {
        console.log(`App - post pdf highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "하이라이트 등록 실패",
        });
    }
};

// app.get('/highlights/pdfs/:pdfIdx/pages/:pageNum', highlight.getPageHighlight);
exports.getPageHighlight = async function (req, res) {

    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 58;
        const pdfIdx = req.params.pdfIdx;  
        const pageNum = req.params.pageNum;    
        const [bookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
        const getHighlightPageInfoRows = await highlightModel.getHighlightPageInfo(bookIdx.userBookIdx, pageNum);
        
        return res.json({
            result: getHighlightPageInfoRows,
            isSuccess: true,
            code: 1000,
            message: "해당 Page 하이라이트들 조회 성공",
        })

    } catch (err) {
        console.log(`App - get page highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "해당 Page 하이라이트들 조회 실패",
        });
    }
};

exports.deleteHighlight = async function (req, res) {

    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 58;
        const highlightIdx = req.params.highlightIdx;      
        const deleteHighlightInfoRows = await highlightModel.deleteHighlightInfo(highlightIdx);
        
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "하이라이트 삭제 성공",
        })
    } catch (err) {
        console.log(`App - delete highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "하이라이트 삭제 실패",
        });
    }
};
