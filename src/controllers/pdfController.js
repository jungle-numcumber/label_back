const pdfModel = require('../model/pdfModel');
const highlightModel = require('../model/highlightModel');


exports.getPdfAll = async function (req, res) {
    try {
        const userIdx = req.params.userIdx;
        const getPdfAllInfoRows = await pdfModel.getPdfAll(userIdx);

        return res.json({
            result: getPdfAllInfoRows,
            isSuccess: true,
            code: 1000,
            message: "모든 pdf 조회 성공",
        })

    } catch (err) {
        console.log(`App - get all pdf info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "모든 pdf 조회 실패",
        });
    }
};




exports.getPdfUserAll = async function (req, res) {

    try {
        const userIdx = req.params.userIdx;
        const getUserPdfInfoRows = await pdfModel.getUserPdfs(userIdx);

        return res.json({
            result: getUserPdfInfoRows,
            isSuccess: true,
            code: 1000,
            message: "유저가 가지고 있는 pdf 조회 성공",
        })

    } catch (err) {
        console.log(`App - get pdf info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "유저가 가지고 있는 pdf 조회 실패",
        });
    }
};


// app.get('/pdfs/:pdfIdx/pages/:pageNum',  pdf.getPdfPage);
exports.getPdfPage = async function (req, res) {

    try {
        const pdfIdx = req.params.pdfIdx;
        const pageNum = req.params.pageNum;
        const userIdx = 58; 

        const [getPdfPageInfoRows] = await pdfModel.getPdfPageLink(pdfIdx,pageNum);
        const [getBookIndexRows] = await highlightModel.getBookIndexInfo(userIdx, getPdfPageInfoRows.pdfIdx)
        const putRecentlyReadPage = await pdfModel.putRecentlyReadPage(pageNum, getBookIndexRows.userBookIdx)
        

        return res.json({
            result: getPdfPageInfoRows,
            isSuccess: true,
            code: 1000,
            message: "pdf page 조회 성공",
        })

    } catch (err) {
        console.log(`App - get pdf page info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "pdf page 조회 실패",
        });
    }
};

exports.getLastIdx = async function (req, res) {

    try {
        const [getLastPdfIdx] = await pdfModel.getLastPdfIdx();

        return res.json({
            result: getLastPdfIdx,
            isSuccess: true,
            code: 1000,
            message: "pdf lastIdx 조회 성공",
        })

    } catch (err) {
        console.log(`App - get lastPDFIdx info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "pdf lastIdx 조회 실패",
        });
    }
};



