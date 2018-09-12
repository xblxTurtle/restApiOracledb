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