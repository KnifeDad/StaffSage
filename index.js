const inquirer = require('inquirer');
const db = require('./lib/Database');
require('console.table');

// Clear console and display welcome message
console.clear();
console.log('\n=== StaffSage ===');
console.log('Employee Management System\n');
console.log('Welcome! Let\'s manage your workforce with a touch of magic! ✨\n');

async function mainMenu() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'View department budget',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'Delete department',
                'Delete role',
                'Delete employee',
                'Exit'
            ]
        }
    ]);

    switch (choice) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'View employees by manager':
            await viewEmployeesByManager();
            break;
        case 'View employees by department':
            await viewEmployeesByDepartment();
            break;
        case 'View department budget':
            await viewDepartmentBudget();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Update employee manager':
            await updateEmployeeManager();
            break;
        case 'Delete department':
            await deleteDepartment();
            break;
        case 'Delete role':
            await deleteRole();
            break;
        case 'Delete employee':
            await deleteEmployee();
            break;
        case 'Exit':
            process.exit(0);
    }
    
    await mainMenu();
}

async function viewDepartments() {
    const departments = await db.query('SELECT * FROM department');
    console.table(departments);
}

async function viewRoles() {
    const roles = await db.query(`
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        JOIN department ON role.department_id = department.id
    `);
    console.table(roles);
}

async function viewEmployees() {
    const employees = await db.query(`
        SELECT 
            e.id,
            e.first_name,
            e.last_name,
            role.title,
            department.name AS department,
            role.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role ON e.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(employees);
}

async function viewEmployeesByManager() {
    const managers = await db.query(`
        SELECT DISTINCT m.id, m.first_name, m.last_name
        FROM employee e
        JOIN employee m ON e.manager_id = m.id
    `);

    const { managerId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Select a manager to view their employees:',
            choices: managers.map(m => ({
                name: `${m.first_name} ${m.last_name}`,
                value: m.id
            }))
        }
    ]);

    const employees = await db.query(`
        SELECT 
            e.first_name,
            e.last_name,
            role.title,
            department.name AS department
        FROM employee e
        JOIN role ON e.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE e.manager_id = $1
    `, [managerId]);

    console.table(employees);
}

async function viewEmployeesByDepartment() {
    const departments = await db.query('SELECT * FROM department');

    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to view its employees:',
            choices: departments.map(dept => ({
                name: dept.name,
                value: dept.id
            }))
        }
    ]);

    const employees = await db.query(`
        SELECT 
            e.first_name,
            e.last_name,
            role.title,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role ON e.role_id = role.id
        LEFT JOIN employee m ON e.manager_id = m.id
        WHERE role.department_id = $1
    `, [departmentId]);

    console.table(employees);
}

async function viewDepartmentBudget() {
    const departments = await db.query('SELECT * FROM department');

    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to view its total utilized budget:',
            choices: departments.map(dept => ({
                name: dept.name,
                value: dept.id
            }))
        }
    ]);

    const result = await db.query(`
        SELECT 
            department.name AS department,
            SUM(role.salary) AS total_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.id = $1
        GROUP BY department.name
    `, [departmentId]);

    console.table(result);
}

async function updateEmployeeRole() {
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');

    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee\'s role do you want to update?',
            choices: employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);

    await db.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );
    console.log('Updated employee\'s role');
}

async function updateEmployeeManager() {
    const employees = await db.query('SELECT * FROM employee');

    const { employeeId, managerId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee\'s manager do you want to update?',
            choices: employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Who is their new manager?',
            choices: [
                { name: 'None', value: null },
                ...employees.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            ]
        }
    ]);

    if (employeeId === managerId) {
        console.log('An employee cannot be their own manager!');
        return;
    }

    await db.query(
        'UPDATE employee SET manager_id = $1 WHERE id = $2',
        [managerId, employeeId]
    );
    console.log('Updated employee\'s manager');
}

async function deleteDepartment() {
    const departments = await db.query('SELECT * FROM department');

    const { departmentId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department do you want to delete?',
            choices: departments.map(dept => ({
                name: dept.name,
                value: dept.id
            }))
        }
    ]);

    try {
        await db.query('DELETE FROM department WHERE id = $1', [departmentId]);
        console.log('Department deleted successfully');
    } catch (error) {
        console.log('Cannot delete department that has roles. Delete associated roles first.');
    }
}

async function deleteRole() {
    const roles = await db.query('SELECT * FROM role');

    const { roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role do you want to delete?',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);

    try {
        await db.query('DELETE FROM role WHERE id = $1', [roleId]);
        console.log('Role deleted successfully');
    } catch (error) {
        console.log('Cannot delete role that has employees. Delete or reassign employees first.');
    }
}

async function deleteEmployee() {
    const employees = await db.query('SELECT * FROM employee');

    const { employeeId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee do you want to delete?',
            choices: employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        }
    ]);

    try {
        // First update any employees that have this employee as their manager
        await db.query('UPDATE employee SET manager_id = NULL WHERE manager_id = $1', [employeeId]);
        // Then delete the employee
        await db.query('DELETE FROM employee WHERE id = $1', [employeeId]);
        console.log('Employee deleted successfully');
    } catch (error) {
        console.log('Error deleting employee:', error.message);
    }
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?'
        }
    ]);

    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to departments`);
}

async function addRole() {
    const departments = await db.query('SELECT * FROM department');
    
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: input => !isNaN(input) || 'Please enter a valid number'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices: departments.map(dept => ({
                name: dept.name,
                value: dept.id
            }))
        }
    ]);

    await db.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
        [title, salary, departmentId]
    );
    console.log(`Added ${title} role`);
}

async function addEmployee() {
    const roles = await db.query('SELECT * FROM role');
    const employees = await db.query('SELECT * FROM employee');

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: "Who is the employee's manager?",
            choices: [
                { name: 'None', value: null },
                ...employees.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            ]
        }
    ]);

    await db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [firstName, lastName, roleId, managerId]
    );
    console.log(`Added ${firstName} ${lastName} to employees`);
}

// Start the application
mainMenu().catch(console.error); 