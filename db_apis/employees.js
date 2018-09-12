const database = require('../services/database');

const baseQuery = 
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
  
async function find(context) {
    let sqlQuery = baseQuery;
    let binds = {}
    if (context.id) {
        binds.employee_id = context.id;
        sqlQuery += ' where employee_id=:employee_id';
    }

    const result = await database.simpleExecute(sqlQuery, binds);
    return result.rows;
}

module.exports.find = find