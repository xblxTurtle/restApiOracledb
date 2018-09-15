const employees = require('../db_apis/employees.js');
const http_status = require('http-status');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;
    context.department_id = req.query.department_id;
    context.manager_id = req.query.manager_id;

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

async function post(req, res, next) {
    
    try {
        let employee = getEmployeeFromReq(req);

        await employees.create(employee);

        res.status(http_status.CREATED).json(employee);
    }
    catch(err) {
        next(err);
    }
}

async function put(req, res, next) {
    try {
        console.log('getting employee from body');
        var employee = getEmployeeFromReq(req);
        console.log('getting employee_id from url');
        employee.employee_id = parseInt(req.params.id,10);
        console.log('sending query to db');
        let context = employee;
        context = await employees.update(context);

        if (employee !== null) {
            res.status(http_status.OK).json(employee);
        } 
        else 
            res.status(http_status.NOT_FOUND).end();
    }
    catch(err) {
        console.log(err);
        console.log(employee);
        next(err);
    }
}

async function remove(req, resp, next) {
    try {
        let employee_id =  parseInt(req.params.id,10);
        let success = await employees.remove(employee_id);
        if (success) {
            resp.status(http_status.NO_CONTENT).end();
        } else {
            resp.status(http_status.NOT_FOUND).end();
        }
    }
    catch(err) {
        next(err);
    }
}

module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
module.exports.delete = remove;