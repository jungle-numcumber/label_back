// #!/usr/bin/env node
const express = require('./config/express')
const port = process.env.PORT || 3000
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });
const setupWSConnection = require('./util').setupWSConnection;

const server = express().listen(port);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// editor room websocket connection
// 클라이언트로부터 connection 이벤트를 받는다. 
wss.on('connection', setupWSConnection);
// 클라이언트로부터 요청을 받는데 header에 upgrade가 포함되어 있으면 upgrade 이벤트가 발생한다.
server.on('upgrade', (request, socket, head) => {
  // 인증 넣기
  // authenticate(request, function next(err, client) {
  //   }

  const handleAuth = ws => {
    // 클라이언트에게 connection 이벤트 보냄
    // Q. 클라이언트 코드에서 connection 이벤트 받는 부분 못찾음.. 라이브러리내에 구현되어있나?
    wss.emit('connection', ws, request)
  }
  // 올바른 요청인지, GET 요청인지 등을 확인하는 함수
  // 정상적인 요청이 확인되면 handleAuth 콜백 실행
  wss.handleUpgrade(request, socket, head, handleAuth)
})
 