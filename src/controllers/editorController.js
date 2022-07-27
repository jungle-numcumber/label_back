const editorModel = require('../model/editorModel');
const highlightModel = require('../model/highlightModel');

exports.getPageHighlightMemo = async function (req, res) {

  try {
      // userIdx 동적으로 수정 예정
      const userIdx = 58;
      const pdfIdx = req.params.pdfIdx;  
      const pageNum = req.params.pageNum;    
      const [bookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
      const [getHighlightInfoRows, getMemoInfoRows] = await editorModel.getPageHighlightMemoInfo(bookIdx.userBookIdx, pageNum);
      // getHighlightInfoRows.add("memos", getMemoInfoRows)
      // const parent = new Object()
      // parent.add("highlights", getHighlightInfoRows)
      // parent.add("memos", getMemoInfoRows)
      




      return res.json({
          highlights: getHighlightInfoRows,
          memos : getMemoInfoRows,
          isSuccess: true,
          code: 1000,
          message: "해당 Page 하이라이트, 메모들을 모두 조회 성공",
      })

  } catch (err) {
      console.log(`App - get page highlight&memo info Query error\n: ${JSON.stringify(err)}`);
      
      return res.json({
          isSuccess: false,
          code: 2000,
          message: "해당 Page 하이라이트, 메모들을 조회 실패",
      });
  }
};