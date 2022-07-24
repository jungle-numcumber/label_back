const searchModel = require('../model/searchModel');

exports.searchHighlight = async function (req, res) {
    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 1;
        const pdfIdx = req.params.pdfIdx;
        const keyword = req.query.keyword;      
        const [bookIdx] = await searchModel.getBookIndexInfo(userIdx, pdfIdx);
        const searchHighlightInfoRows = await searchModel.searchHighlightInfo(bookIdx.userBookIdx,keyword);
        
        return res.json({
            result: searchHighlightInfoRows,
            isSuccess: true,
            code: 1000,
            message: "하이라이트 검색 성공",
        })

    } catch (err) {
        console.log(`App - search pdf highlight info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "하이라이트 검색 실패",
        });
    }
};

exports.searchBooks = async function (req, res) {
    try {
        // userIdx 동적으로 수정 예정
        const userIdx = 1;
        const keyword = req.query.keyword;
        const searchHighlightInfoRows = await searchModel.searchBookInfo(userIdx,keyword);
        
        return res.json({
            result: searchHighlightInfoRows,
            isSuccess: true,
            code: 1000,
            message: "책 검색 성공",
        })

    } catch (err) {
        console.log(`App - search book info Query error\n: ${JSON.stringify(err)}`);
        
        return res.json({
            isSuccess: false,
            code: 2000,
            message: "책 검색 실패",
        });
    }
};