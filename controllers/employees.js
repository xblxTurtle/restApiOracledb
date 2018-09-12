const employees = require('../db_apis/employees.js');
const http_status = require('http-status');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);

    const rows = await employees.find(context);

    if (req.params.id) {
      if (rows.length === 1) {
        res.status(http_status.OK).json(rows[0]);
      } else {
        res.status(http_status.NOT_FOUND).end();
      }
    } else {
      res.status(http_status.OK).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;