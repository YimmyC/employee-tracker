const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.PW,
    database: "tracker",
  },
  console.log(`Connected to the tracker database.`)
);

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
}

function viewRoles() {
  db.query("SELECT role.id, role.title, role.salary, department.dept_name FROM role JOIN department ON role.department_id = department.id", function (err, results) {
    console.table(results);
  });
}

function viewEmployees() {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, results) {
    console.table(results);
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department name?",
        name: "name",
      },
    ])
    .then((answer) => {
      db.query("INSERT INTO department SET ?", answer, function (err, results) {
        console.log("Department added!");
      });
    });
}

function addRole() {
  db.query("SELECT * FROM department", function (err, results) {
    const departments = results.map((department) => ({ name: department.dept_name, value: department.id }));
    inquirer
      .prompt([
        {
          message: "What is the title?",
          name: "title",
        },
        {
          message: "What is the salery?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department does the role belong to?",
          name: "department_id",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query("INSERT INTO role SET ?", answer, function (err, results) {
          console.log("Role added!");
        });
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM role", function (err, results) {
    const roles = results.map((role) => ({ name: role.title, value: role.id }));
    db.query("SELECT * FROM employee", function (err, results) {
      const managers = results.map((manager) => ({ name: manager.first_name + " " + manager.last_name, value: manager.id }));
      managers.unshift({ name: "none", value: null });
      inquirer
        .prompt([
          {
            message: "What is their first name?",
            name: "first_name",
          },
          {
            message: "What is their last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is their role?",
            name: "role_id",
            choices: roles,
          },
          {
            type: "list",
            message: "Who is their manager?",
            name: "manager_id",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query("INSERT INTO employee SET ?", answer, function (err, results) {
            console.log("Employee added!");
          });
        });
    });
  });
}

function updateEmployee() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employees = results.map((employee) => ({ name: employee.first_name, value: employee.id }));
    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({ name: role.title, value: role.id }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "id",
            choices: employees,
          },
          {
            type: "list",
            message: "What is their new role?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((answer) => {
          db.query("UPDATE employee SET role_id = ? WHERE id = ?", answer, function (err, results) {
            console.log(answer);
            console.log("Employee Updated!");
          });
        });
    });
  });
}

function anotherOne() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          { name: "View all departments", value: "VIEW_DEPARTMENTS" },
          { name: "View all roles", value: "VIEW_ROLES" },
          { name: "View all employees", value: "VIEW_EMPLOYEES" },
          { name: "Add a Department", value: "ADD_DEPARTMENT" },
          { name: "Add a Role", value: "ADD_ROLE" },
          { name: "Add an Employee", value: "ADD_EMPLOYEE" },
          { name: "Update Employee", value: "UPDATE_EMPLOYEE" },
          { name: "Exit?", value: "EXIT" },
        ],
      },
    ])
    .then((response) => {
      if (response.choice === "VIEW_DEPARTMENTS") {
        viewDepartments();
      }
      if (response.choice === "VIEW_ROLES") {
        viewRoles();
      }
      if (response.choice === "VIEW_EMPLOYEES") {
        viewEmployees();
      }
      if (response.choice === "ADD_DEPARTMENT") {
        addDepartment();
      }
      if (response.choice === "ADD_ROLE") {
        addRole();
      }
      if (response.choice === "ADD_EMPLOYEE") {
        addEmployee();
      }
      if (response.choice === "UPDATE_EMPLOYEE") {
        updateEmployee();
      }
      if (response.choice === "EXIT") {
        process.exit();
      }
      // else {
      //   anotherOne();
      // }
    });
}

anotherOne();
