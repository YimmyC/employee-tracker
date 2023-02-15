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
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
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
    const departments = results.map((department) => ({ name: department.name, value: department.id }));
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
      if (response.choice === "EXIT") {
        process.exit();
      }
      // else {
      //   anotherOne();
      // }
    });
}

anotherOne();
