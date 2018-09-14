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

function getEmployeeFromReq(req) {

    let employee = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        hire_date: req.body.hire_date,
        job_id: req.body.job_id,
        salary: req.body.salary,
        commission_pct: req.body.commission_pct,
        manager_id: req.body.manager_id,
        department_id: req.body.department_id
    }

    return employee;
}

async function post(req, resp, next) {
    
    try {
        let employee = getEmployeeFromReq(req);

        await employees.create(employee);

        res.status(http_status.CREATED).json(employee);
    }
    catch(err) {
        next(err);
    }
}

module.exports.get = get;
module.exports.post = post;