const database = require('../services/database');
const oracledb = require('oracledb')

const baseSelectQuery = 
 `select employee_id "id",
    first_name "first_name",
    last_name "last_name",
    email "email",
    phone_number "phone_number",
    hire_date "hire_date",
    job_id "job_id",
    salary "salary",
    commission_pct "commission_pct",
    manager_id "manager_id",
    department_id "department_id"
  from employees`;

  const baseInsertQuery = 
  `INSERT INTO employees
(
    first_name, 
    last_name, 
    email, 
    phone_number, 
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id)
VALUES
(
    :first_name, 
    :last_name, 
    :email, 
    :phone_number, 
    :hire_date,
    :job_id,
    :salary,
    :commission_pct,
    :manager_id,
    :department_id)
    returning employee_id into :employee_id;
    `;

async function find(context) {
    let sqlQuery = baseSelectQuery;
    let binds = {}
    if (context.id) {
        binds.employee_id = context.id;
        sqlQuery += ' where employee_id=:employee_id';
    }

    const result = await database.simpleExecute(sqlQuery, binds);
    return result.rows;
}

async function create(context) {
    let employee = context;
    employee.employee_id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    };
    let sqlQuery = baseInsertQuery
    const result = await database.simpleExecute(sqlQuery, context);
    
    employee.employee_id = result.outBinds.employee_id[0];

    return employee;
}

module.exports.find = find
module.exports.create = create