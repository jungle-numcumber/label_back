const memoModel = require('../model/memoModel');
const highlightModel = require('../model/highlightModel');

async function argCheck(temp) {
  if(typeof temp === 'undefined' || temp === null || temp === ''){
      return true;
  }
  else {
      return false;
  }
}

async function textCheck(temp) {
  if(typeof temp === 'undefined' || temp === null){
      return true;
  }
  else {
      return false;
  }
}



// 특정 user, 특정 book, 특정 highlight 의 memo를 다 가져오는 경우
exports.getMemo = async function(req, res) { 
  try {
    //회원가입 추가 후, userIdx 수정 예정 
    // const userIdx = req.params.userIdx;
    const highlightIdx = req.params.highlightIdx;
    const getHighlightMemoInfoRows = await memoModel.getHighlightMemoInfo(highlightIdx);

    return res.json({
      result: getHighlightMemoInfoRows, 
      isSuccess : true, 
      code : 1000, 
      message: "해당 highlight에 대한 memo 조회 성공", 
    })
  } catch (err) { 
    console.log(`App - get user memo info Query error\n: ${JSON.stringify(err)}`);
    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "해당 유저의 memo 조회 실패",
    });
  }
};

// highlightIdx를 기준으로 memo 추가 
exports.postMemo = async function(req, res) {
  try{ 
    const userIdx = 58;
    // const {pdfIdx, commitMessage, logs} = req.body;
    const {data, pdfIdx} = req.body;
    const highlightIdx = req.params.highlightIdx;
    let checkHighlightIdx = await argCheck(highlightIdx);
    let checkUserIdx = await argCheck(userIdx);
    let checkpdfIdx = await argCheck(pdfIdx);
    let checkData = await argCheck(data);

    if ( checkHighlightIdx || checkUserIdx || checkpdfIdx || checkData){
      return res.json({
        isSuccess: false,
        code: 2200,
        message: "body 인자를 제대로 입력하세요",
      })
    }
    const [userBookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
    const postCommitRows = await memoModel.postMemoInfo(userBookIdx.userBookIdx, highlightIdx, data);

    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "memo 등록 성공",
    })
  } catch (err) { 
    console.log(`App - post commit info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code:2000, 
      message: "memo 등록 실패", 
    })
  }
};

// app.put('/highlights/:highlightIdx/memo/:memoIdx', highlight.putPageHighlight);
exports.putMemo = async function (req, res) { 
  try{
    const userIdx = 58;
    const memoIdx = req.params.memoIdx;
    const data = req.body.data;
    let checkData = await textCheck(data);

    if (checkData){
      return res.json({
        isSuccess: false,
        code: 2200,
        message: "body 인자를 제대로 입력하세요",
      })
    }

    const putMemoInfoRows = await memoModel.putMemoInfo(memoIdx, data);
    
    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "memo 수정 성공",
    })
  } catch (err) {
    console.log(`App - update memo info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "memo 수정 실패",
    })
  }
}


// app.delete('/highlights/:highlightIdx/memo/:memoIdx', memo.deleteMemo);
exports.deleteMemo = async function (req, res) { 
  try { 
    // 본인인지 인증하는 절차 필요?
    const userIdx = 58;
    const memoIdx = req.params.memoIdx;
    const deleteMemoInfoRows = await memoModel.deleteMemoInfo(memoIdx);

    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "memo 삭제 성공",
    })
  } catch (err) {
    console.log(`App - delete memo info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "memo 삭제 실패",
    })
  }

}