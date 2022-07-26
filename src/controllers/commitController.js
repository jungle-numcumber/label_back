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
    // 회원가입 추가 후, userIdx 수정 예정 
    const userIdx = req.body.userIdx;
    const userBookIdx = req.body.userBookIdx;
    console.log(userIdx,userBookIdx)
    const commits = await commitModel.getBookCommitInfo(userIdx, userBookIdx);
    console.log(commits);
    return res.json({
      result: commits, 
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

// -> 한 user의 특정 commitIdx에 해당하는 commit을 가져온다. 
exports.getBookCommitWithIdx = async function(req, res) { 
  try {
    // 회원가입 추가 후, userIdx 수정 예정 
    const userCommitIdx = req.body.commitIdx;
    const commits = await commitModel.getBookCommitInfoWithIdx(userCommitIdx);
    console.log(commits);
    return res.json({
      result: commits, 
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
    const userIdx = req.body.userIdx;
    const userBookIdx = req.body.userBookIdx;
    const commitMessage = req.body.commitMessage;
    // const logs = req.params.logs;
    const createdAt = req.body.createdAt;
    const editorLog = req.body.editorLog;

    let checkUserIdx = await argCheck(userIdx);
    let checkUserBookIdx = await argCheck(userBookIdx);
    let checkCreatedAt = await argCheck(createdAt);
    // console.log(userIdx, userBookIdx, createdAt)
    if ( checkUserIdx || checkUserBookIdx || checkCreatedAt){
      return res.json({
        isSuccess: false,
        code: 2200,
        message: "body 인자를 제대로 입력하세요",
      })
    }
    // console.log(userIdx,userBookIdx)
    let logObject = {}
    const currentHighlight = await highlightModel.getCurrentHighlight(userBookIdx);
    // console.log(currentHighlight);
    for (i = 0; i < currentHighlight.length; i++) {
      // console.log('num:',i,currentHighlight[i])
      if (logObject[currentHighlight[i]['pageNum']] === undefined) {
        logObject[currentHighlight[i]['pageNum']] = [currentHighlight[i]['highlightIdx']];
      } else {
        logObject[currentHighlight[i]['pageNum']].push(currentHighlight[i]['highlightIdx']);
      }
    }
    // console.log(logObject);
    
    let logString = JSON.stringify(logObject);
    const postCommitRows = await commitModel.postCommitInfo(userIdx, userBookIdx, commitMessage, logString, createdAt, editorLog);

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
    const commitIdx = req.body.commitIdx;
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
    const userIdx = req.body.userIdx;
    const userBookIdx = req.body.userBookIdx;
    const createdAt = req.body.createdAt;
    // const commitIdx = req.params.commitIdx;
    // const commit = await commitModel(req,params.userIdx, req.params.userBookIdx, req.params.createAt);
    const deleteHighlightInfoRows = await commitModel.deleteCommitInfo(userIdx, userBookIdx, createdAt);

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