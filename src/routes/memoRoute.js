module.exports = function(app){
  const memo = require('../controllers/memoController');

  app.get('/highlights/:highlightIdx/memo/:memoIdx',  memo.getMemo);
  app.post('/highlights/:highlightIdx/memo', memo.postMemo);
  app.put('/highlights/:highlightIdx/memo/:memoIdx', memo.putMemo);
  app.delete('/highlights/:highlightIdx/memo/:memoIdx', memo.deleteMemo);
};