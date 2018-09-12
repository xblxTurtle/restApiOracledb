const http = require('http');
const express = require('express');
const logger = require("morgan");
const webServerConfig = require('../config/web-server.js');
const database = require('./database.js');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    app.use(logger('combined'));
        
    app.get('/', async (req, res) => {
      const result = await database.simpleExecute('select user, systimestamp from dual');
      const user = result.rows[0].USER;
      const date = result.rows[0].SYSTIMESTAMP;
      console.log(JSON.stringify(result, null, 4));
      res.end(`DB user: ${user}\nDate: ${date}`);
    });

    app.use('/api',)
    

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