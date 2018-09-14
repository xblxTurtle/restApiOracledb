const http = require('http');
const express = require('express');
const logger = require("morgan");
const webServerConfig = require('../config/web-server.js');
const router = require('./router');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    app.use(logger('combined'));
    app.use('/api',router);
    app.use(express.json({reviver: reviveJson}));
    
    httpServer.listen(webServerConfig.port, err => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`Web server listening on localhost:${webServerConfig.port}`);

      resolve();
    });
  });
}


const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
  if ((typeof value === 'string') && (iso8601RegExp.test(value))) {
    return new Date(value);
  } else 
  return value;
}

function close() {
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve();
      });
    });
  }
  
module.exports.close = close;
module.exports.initialize = initialize;