// Layout from week 12 lesson 11

const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "hades666phanes!",
    database: "employees_db",
    multipleStatements: true,
  },(database) => {
    console.log(`Connected to the employees_db database`, database);
  }
);

// mysql -y root -p
// mySQL 
// npm start server.js
// node server.js


// const viewEmployees

// const viewDepartments

// const viewRoles 

// const addEmployee

// const addDepartment

// const addRole

// const askEmployeeQuestionsAndThenAddEmployee

// inquirer.prompt(questionsToAsk)

// const updateAnEmployeeRole

// const mainMenuChoices

// const startMenu


const startPrompt = [
    {
        name: "Selector",
        type: "list",
        message: "Select an option",
        choices: [
          "View departments",
          "View roles",
          "View employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee",
          "EXIT" 
        ]
    }
];

// Get and post routes here
// any other queries
// delete routes
// Query database

db.query("SELECT * FROM employee", function (err, results) {
  console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Where we are connected
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Last line is to call the entire startMenu() function to run the app and begin the prompting process