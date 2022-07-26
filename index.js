const express = require('./config/express');

const port = 3001;
express().listen(port);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

