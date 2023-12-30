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
  },
  console.log(`Connected to the employees_db database.`)
);

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

// mysql -y root -p
// mySQL 
// npm start server.js
// node server.js

// An array of prompts
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