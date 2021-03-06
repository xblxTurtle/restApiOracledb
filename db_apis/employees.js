const database = require('../services/database');
const oracledb = require('oracledb')

const employeeColumnsList = [
    'employee_id',
    'first_name', 
    'last_name', 
    'email', 
    'phone_number', 
    'hire_date',
    'job_id',
    'salary',
    'commission_pct',
    'manager_id',
    'department_id'
]
const baseRemoveQuery =
 `begin
 
    delete from job_history
    where employee_id = :employee_id;
 
    delete from employees
    where employee_id = :employee_id;
 
    :rowcount := sql%rowcount;
 
  end;`

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
  from employees
  where
    1 = 1`;

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
    returning employee_id 
    into :employee_id`;

const baseUpdateQuery = 
`UPDATE employees
SET 
    first_name = :first_name, 
    last_name = :last_name, 
    email = :email, 
    phone_number = :phone_number, 
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
WHERE
    employee_id = :employee_id
    `;

async function find(context) {
    let sqlQuery = baseSelectQuery;
    let binds = {}

    console.log('context == '+JSON.stringify(context,null,4));

    if (context.id) {
        binds.employee_id = context.id;
        sqlQuery += ' AND employee_id=:employee_id';
    }
    
    if (context.department_id) {
        binds.department_id = context.department_id;
        sqlQuery += ' AND department_id=:department_id';
    }

    if (context.manager_id) {
        binds.manager_id = context.manager_id;
        sqlQuery += ' AND manager_id=:manager_id';
    }

    let ar = (context.sort)?context.sort.split(':'):[];
    if ((ar.length === 2)
    &&(employeeColumnsList.includes(ar[0].toLowerCase())
    &&(ar[1].toLowerCase() === 'asc' || ar[1].toLowerCase() === 'desc'))) {
        sqlQuery += ` ORDER BY ${ar[0]} ${ar[1]}`; 
    } else {
        sqlQuery += ' ORDER BY Employee_Id asc';
    }

    if (context.skip) {
        sqlQuery += ' OFFSET :skip ROWS';
        binds.skip = context.skip
    }

    context.limit = (context.limit > 0)? context.limit : 30;
    sqlQuery += ' FETCH NEXT :limit ROWS ONLY';
    binds.limit = context.limit;
    
    
    console.log(sqlQuery);
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

async function update(context) {
    const employee = Object.assign({}, context);
    let query = baseUpdateQuery;
    const result = await database.simpleExecute(query, employee);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return employee;
      } else {
        return null;
      }
    
}

async function remove(employee_id) {
    let query = baseRemoveQuery;
    let bind = {}
    bind.employee_id = employee_id;
    bind.rowcount = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER  
    };
    let result = await database.simpleExecute(query, bind);

    return result.outBinds.rowcount === 1;
}

module.exports.update = update;
module.exports.find = find;
module.exports.create = create;
module.exports.remove = remove;