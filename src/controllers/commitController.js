const commitModel = require('../model/commitModel');
const highlightModel = require('../model/highlightModel');

//값들이 제대로들어왔는지를 확인하기 위해서 사용
async function argCheck(temp) {
  if(typeof temp === 'undefined' || temp === null || temp === ''){
      return true;
  }
  else {
      return false;
  }
}


// -> 한 user의 전체 commit을 가져온다. 
exports.getAllCommit = async function(req, res) { 
  try {
    //회원가입 추가 후, userIdx 수정 예정 
    // const userIdx = req.params.userIdx;
    const userIdx = 1;
    const getUserCommitInfoRows = await commitModel.getUserCommitInfo(userIdx);

    return res.json({
      result: getUserCommitInfoRows, 
      isSuccess : true, 
      code : 1000, 
      message: "해당 유저의 commit 조회 성공", 
    })
  } catch (err) { 
    console.log(`App - get user commit info Query error\n: ${JSON.stringify(err)}`);
    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "해당 유저의 commit 조회 실패",
    });
  }
};

// -> 한 user의 특정 book의 commit을 가져온다. 
exports.getBookCommit = async function(req, res) { 
  try {
    //회원가입 추가 후, userIdx 수정 예정 
    // const userIdx = req.params.userIdx;
    const userIdx = 1;
    const pdfIdx = req.params.pdfIdx;
    const [userBookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
    const getBookCommitInfoRows = await commitModel.getBookCommitInfo(userBookIdx.userBookIdx);

    return res.json({
      result: getBookCommitInfoRows, 
      isSuccess : true, 
      code : 1000, 
      message: "해당 유저의 commit 조회 성공", 
    })
  } catch (err) { 
    console.log(`App - get user commit info Query error\n: ${JSON.stringify(err)}`);
    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "해당 유저의 commit 조회 실패",
    });
  }
};


exports.postCommit = async function(req, res) {
  try{ 
    const userIdx = 1;
    const logs = '[]'; 
    // const {pdfIdx, commitMessage, logs} = req.body;
    const {pdfIdx, commitMessage} = req.body;
    let checkUserIdx = await argCheck(userIdx);
    let checkpdfIdx = await argCheck(pdfIdx);
    let checkCommitMessage = await argCheck(commitMessage);
    let checkLogs = await argCheck(logs);

    if ( checkUserIdx || checkpdfIdx || checkCommitMessage || checkLogs){
      return res.json({
        isSuccess: false,
        code: 2200,
        message: "body 인자를 제대로 입력하세요",
      })
    }
    const [userBookIdx] = await highlightModel.getBookIndexInfo(userIdx, pdfIdx);
    const postCommitRows = await commitModel.postCommitInfo(userIdx, userBookIdx.userBookIdx, commitMessage, logs);

    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "커밋 등록 성공",
    })
  } catch (err) { 
    console.log(`App - post commit info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code:2000, 
      message: "커밋 등록 실패", 
    })
  }
};

//app.put('/users/:userIdx/commits/:commitIdx', commit.putCommit);
exports.putCommit = async function (req, res) { 
  try{
    const userIdx = 1;
    const commitIdx = req.params.commitIdx;
    const commitMessage = req.body.commitMessage;
    
    let checkCommitMessage = await argCheck(commitMessage);

    if (checkCommitMessage){
      return res.json({
        isSuccess: false,
        code: 2200,
        message: "body 인자를 제대로 입력하세요",
      })
    }

    const putHighlightInfoRows = await commitModel.putCommitInfo(commitIdx, commitMessage);
    
    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "커밋 수정 성공",
    })
  } catch (err) {
    console.log(`App - delete commit info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "커밋 수정 실패",
    })
  }
}



exports.deleteCommit = async function (req, res) { 
  try { 
    // 본인인지 인증하는 절차 필요?
    const userIdx = 1;
    const commitIdx = req.params.commitIdx;
    const deleteHighlightInfoRows = await commitModel.deleteCommitInfo(commitIdx);


    return res.json({
      isSuccess: true, 
      code: 1000, 
      message: "커밋 삭제 성공",
    })
  } catch (err) {
    console.log(`App - delete commit info Query error\n: ${JSON.stringify(err)}`);

    return res.json({
      isSuccess: false, 
      code: 2000, 
      message: "커밋 삭제 실패",
    })
  }

}