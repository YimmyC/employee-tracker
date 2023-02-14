const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [{ name: "View all departments", value: "VIEW_DEPARTMENTS" }],
    },
  ])
  .then((response) => {
    console.log(response.choice);
  });
