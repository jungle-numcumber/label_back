#!/usr/bin/env node

/**
 * @type {any}
 */
 const WebSocket = require('ws')
 const http = require('http')
 const wss = new WebSocket.Server({ noServer: true })
 const setupWSConnection = require('./util.js').setupWSConnection
 
 const host = process.env.HOST || 'localhost'
 const port = process.env.PORT || 3000
 
 const server = http.createServer((request, response) => {
   response.writeHead(200, { 'Content-Type': 'text/plain' })
   response.end('okay')
 })
 
 wss.on('connection', setupWSConnection)
 
 server.on('upgrade', (request, socket, head) => {
   // You may check auth of request here..
   // See https://github.com/websockets/ws#client-authentication
   /**
    * @param {any} ws
    */
   const handleAuth = ws => {
     wss.emit('connection', ws, request)
   }
   wss.handleUpgrade(request, socket, head, handleAuth)
 })
 
 server.listen(port, () => {
   console.log(`running at '${host}' on port ${port}`)
 })
// // import * as express from '../config/express.js';
// // const express = require('./config/express');
// const port = 3000;
// // const http = require('http')
// import http from 'http';
// // import * as WebSocket from 'ws';
// // import WebSocket from 'ws';
// import WebSocket, { WebSocketServer } from "ws";
// // const WebSocket = require('ws')
// const wss = new WebSocketServer({ noServer: true });
// import * as setupWSConnectionBefore from './util.js';
// console.log(setupWSConnectionBefore.setupWS);
// const setupWSConnection = setupWSConnectionBefore.setupWS;
// // const setupWSConnection = require('./util.js').setupWS;
// wss.on('connection', setupWSConnection)

// // express().listen(port);
// console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

//  const host = process.env.HOST || 'localhost'
 
//  const server = http.createServer((request, response) => {
//    response.writeHead(200, { 'Content-Type': 'text/plain' })
//    response.end('okay')
//  })
 
//  wss.on('connection', setupWSConnection)
 
//  server.on('upgrade', (request, socket, head) => {
//    // You may check auth of request here..
//    // See https://github.com/websockets/ws#client-authentication
//    /**
//     * @param {any} ws
//     */
//    const handleAuth = ws => {
//      wss.emit('connection', ws, request)
//    }
//    wss.handleUpgrade(request, socket, head, handleAuth)
//  })
 
//  server.listen(port, () => {
//    console.log(`running at '${host}' on port ${port}`)
//  })