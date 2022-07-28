module.exports = function(app){
  const commit = require('../controllers/commitController');

  app.get('/commits/users/:userIdx/books/:pdfIdx', commit.getBookCommit); // user의 특정 book의 commit을 가져온다.
  app.get('/commits/users/:userIdx', commit.getAllCommit); // user의 전체 commit을 가져온다. 
  app.post('/commits/books/2/:pdfIdx', commit.getBookCommitWithIdx); // user의 특정 book의 commit을 가져온다.
  app.post('/commits', commit.postCommit); // user의 commit 저장
  app.put('/commits/:commitIdx', commit.putCommit); 
  app.delete('/commits/:commitIdx', commit.deleteCommit); // user의 commit 삭제
}