// The tree of code!
const mySQL2 = require(`mysql2`);
const express = require(`express`);
const inquirer = require(`inquirer`);
const Role = require("./db/models/Role");
const Employee = require("./db/models/Employee");
const Department = require("./db/models/Department");

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
const viewDepartments = ( res = false, server = false, sortByNewestFirst = false ) => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (error, departments) => {
    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`error fetching departments`, error);
      }
      return;
    }
    if (server == true) {
      res.json({
        message: "success",
        data: departments,
      });
    } else {
      if (departments.length > 0) {
        let databaseDepartments = departments.map(dep => new Department(dep));
        console.table(databaseDepartments);
      } else {
        console.log(`No Departments to view!`);
      }
      setTimeout(() => {
        startMenu();
      }, 4000)
    }
  });
}

// const viewRoles 

// const addEmployee

// const addDepartment

// const addRole

// const askEmployeeQuestionsAndThenAddEmployee

// inquirer.prompt(questionsToAsk)

// const updateAnEmployeeRole

// const mainMenuChoices

// const startMenu


const mainMenuChoices = {
  ViewAllDepartments: `View all departments`,
  ViewAllRoles: `View all roles`,
  ViewAllEmployees: `View all employees`,
  AddADepartment: `Add a department`,
  AddAnEmployee: `Add an employee`,
  AddARole: `Add a role`,
  UpdateAnEmployeeRole: `Update an employee role`,
}

const mainMenuQuestions = [
  {
    name: `choice`,
    type: `list`,
    message: `Make a selection`,
    choices: Object.values(mainMenuChoices)
  }
];

const startMenu = () => {
  inquirer.prompt(mainMenuQuestions).then(userResponse => {
    let choice = userResponse.choice;
    
    if (choice == mainMenuChoices.ViewAllEmployees) {
      viewEmployees();
    } else if (choice == mainMenuChoices.AddAnEmployee) {
     functionToSetupHere();
    } else if (choice == mainMenuChoices.ViewAllDepartments) {
      viewDepartments();
    } else if (choice == mainMenuChoices.ViewAllRoles) {
      viewRoles();
    } else if (choice == mainMenuChoices.AddADepartment) {
      addDepartment();
    } else if (choice == mainMenuChoices.AddARole) {
      addRole();
    } else if (choice == mainMenuChoices.UpdateAnEmployeeRole) {
      updateAnEmployeeRole();
    } else {
      console.log(`Under Construction!`);
      setTimeout(() => {
        startMenu();
      }, 4000);
    }
  });
};

// Get and post routes here
// app.get (for each route - employees, departments, new employees, roles, employees roles, new departments, etc)
// any other queries
// delete routes
// app.delete

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
startMenu()