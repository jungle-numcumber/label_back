const editorModel = require('../model/editorModel');

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
        const userIdx = 1;
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