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
const db = mySQL2.createConnection(
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

const roleLevels = {
  Chief: 1,
  Magistrate: 2,
  Warden: 3,
  Minister: 4,
  King: 5,
}

// Used in places such as the addEmployee, so that the names are structured nicely, since users won't always capitalize every first letter of a name.
capWords = (str) => {
  return str.replace(/\b\w/g, (match) => {
    return match.toUpperCase();
  });
}

// (Chief, 100000, 1),
// (Magistrate, 75000, 2),
// (Warden, 85000, 3),
// (Minister, 90000, 4),
// (King, 80000, 5);

// mysql -y root -p
// mySQL 
// npm start server.js
// node server.js


// const viewEmployees
const viewEmployees = ( res = false, server = false, newestFirst = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        manager_id: isManager ? null : managerOfEmployee.id,
        salary: parseFloat(thisEmployeesRole.salary).toLocaleString(`en-US`),
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    if (newestFirst == true) {
      expandedEmployees = expandedEmployees.reverse();
      // expandedEmployees = expandedEmployees.sort((firstEmployee, secondEmployee) => secondEmployee.id - firstEmployee.id);
    };

    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`error getting employees`, error);
      }
      return;
    }
  
    if (server == true) {
      res.json({
        message: "success",
        data: expandedEmployees,
      });
    } else {
      if (expandedEmployees.length > 0) {
        console.table(expandedEmployees);
      } else {
        console.log(`There are no Employees in the Database Currently`);
      }
      setTimeout(() => {
        startMenu();
      }, 3000)
    }
  });
}

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
        if (sortByNewestFirst == true) databaseDepartments = databaseDepartments.reverse();
        console.table(databaseDepartments);
      } else {
        console.log(`No Departments to view!`);
      }
      setTimeout(() => {
        startMenu();
      }, 3000)
    }
  });
}

// const viewRoles 

const viewRoles = async ( res = false, server = false, sortByNewestFirst = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`couldnt fetch roles`, error);
      }
      return;
    }
  
    if (server == true) {
      res.json({
        message: "success",
        data: expandedRoles,
      });
    } else {
      if (expandedRoles.length > 0) {
        if (sortByNewestFirst == true) expandedRoles = expandedRoles.reverse();
        console.table(expandedRoles);
      } else {
        console.log(`NO roles in DB`);
      }
      setTimeout(() => {
        startMenu();
      }, 3000)
    }
  });
}

// const addEmployee
const addEmployee = (first_name, last_name, manager_id, role_id, req = false, res = false, server = false) => {
  const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?);`;
  if (server == true) {
    let { body } = req;
    const params = [body.first_name, body.last_name, body.manager_id, body.role_id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  } else {
    const params = [capWords(first_name), capWords(last_name), manager_id, role_id];
    db.query(sql, params, (err, addedEmployeeMessage) => {
      if (err) {
       console.log({ error: err.message });
        return;
      }
      console.log(`Successfully Added Employee`);
      let sortByNewestFirst = true;
      viewEmployees(false, false, sortByNewestFirst);
    });
  }
}

const addDepartment = ( req = false, res = false, server = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;
  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        salary: parseFloat(thisEmployeesRole.salary).toLocaleString(`en-US`),
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        fullName: `${emp.first_name} ${emp.last_name}`,
        manager_id: isManager ? null : managerOfEmployee.id,
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    let managers = expandedEmployees.filter(emp => emp.role_id == roleLevels.Manager);
    let managerNames = managers.map(emp => emp.fullName);

    inquirer.prompt([
      {
        type: `input`,
        name: `departmentName`,
        message: `What is the name of the department?`,
      }
    ]).then(response => {
      let departmentName = response.departmentName;
      let currentCapitalizedDepartmentName = capWords(departmentName);
      let departmentNames = departments.map(dep => dep.name);

      if (departmentNames.includes(currentCapitalizedDepartmentName)) {
        console.log(`Department Already Exists`);
        setTimeout(() => {
          startMenu();
        }, 3000);
        return;
      } else {
        const sql = `INSERT INTO departments (name) VALUES (?);`;
        if (server == true) {
          let { body } = req;
          const params = [body.departmentName];
          db.query(sql, params, (err, result) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
            res.json({
              message: "successfully added a department:",
              data: body,
            });
          });
        } else {
          const params = [currentCapitalizedDepartmentName];
          db.query(sql, params, (err, addedDepartmentMessage) => {
            if (err) {
             console.log({ error: err.message });
              return;
            }
            console.log(`Successfully Added Department`);
            let sortByNewestFirst = true;
            viewDepartments(false, false, sortByNewestFirst);
          });
        }
      }

    })
  });
};

const addRole = ( req = false, res = false, server = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;
  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        salary: parseFloat(thisEmployeesRole.salary).toLocaleString(`en-US`),
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        fullName: `${emp.first_name} ${emp.last_name}`,
        manager_id: isManager ? null : managerOfEmployee.id,
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    let managers = expandedEmployees.filter(emp => emp.role_id == roleLevels.Manager);
    let managerNames = managers.map(emp => emp.fullName);
    let deparmentNames = departments.map(dep => dep.name);

    inquirer.prompt([
      {
        type: `input`,
        name: `roleName`,
        message: `What is the name of the Role?`,
      },
      {
        type: `input`,
        name: `salary`,
        message: `What is the Salary for this position?`
      },
      {
        name: `department`,
        type: `list`,
        choices: deparmentNames
      }
    ]).then(response => {
      let salary = response.salary;
      let roleName = response.roleName;
      let currentCapitalizedRoleName = capWords(roleName);
      let roleNames = expandedRoles.map(rol => rol.title);
      let selectedDepartment = response.department;
      let selectedDepartmentID = departments.find(dep => dep.name == selectedDepartment).id;

      if (roleNames.includes(currentCapitalizedRoleName)) {
        console.log(`Role Exists..`);
        setTimeout(() => {
          startMenu();
        }, 3000);
        return;
      } else {
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
        if (server == true) {
          let { body } = req;
          const params = [body.roleName, body.salary, body.selectedDepartmentID];
          db.query(sql, params, (err, result) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
            res.json({
              message: "Added Role!:",
              data: body,
            });
          });
        } else {
          const params = [currentCapitalizedRoleName, salary, selectedDepartmentID];
          db.query(sql, params, (err, addedRoleMessage) => {
            if (err) {
             console.log({ error: err.message });
              return;
            }
            console.log(`Added a Role!`);
            let sortByNewestFirst = true;
            viewRoles(false, false, sortByNewestFirst);
          });
        }
      }
    })
  });
};

const askEmployeeQuestionsAndThenAddEmployee = () => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        salary: parseFloat(thisEmployeesRole.salary).toLocaleString(`en-US`),
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        fullName: `${emp.first_name} ${emp.last_name}`,
        manager_id: isManager ? null : managerOfEmployee.id,
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    let managers = expandedEmployees.filter(emp => emp.role_id == roleLevels.Manager);
    let managerNames = managers.map(emp => emp.fullName);

    let choices = expandedRoles.map(rol => rol.title);
    let questionsToAsk = [
      {
        type: `input`,
        name: `first_name`,
        message: `What is the first name of the employee?`,
      },
      {
        type: `input`,
        name: `last_name`,
        message: `What is the last name of the employee?`,
      },
      {
        choices,
        name: `role`,
        type: `list`,
        message: `What is the role of the employee?`,
      },
      {
        type: `list`,
        name: `manager`,
        choices: managerNames,
        message: `Who is the manager of this employee?`,
        when(response) {
          return response.role != `Manager`;
        }
      }
    ];
  
    inquirer.prompt(questionsToAsk).then(employeeResponse => {
      let { first_name, last_name, role, manager } = employeeResponse;
      let role_id = roles.find(rol => rol.title == role).id;
      let manager_id = manager ? managers.find(mang => `${mang.first_name} ${mang.last_name}` == manager)?.id : expandedEmployees.length + 1;
      
      if (expandedEmployees.find(emp => emp.first_name == first_name && emp.last_name == last_name)) {
        console.log(`Employee Exists, Same Name Taken`);
        return;
      } else {
        addEmployee(first_name, last_name, manager_id, role_id);
      }
    })
  });
}

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
      askEmployeeQuestionsAndThenAddEmployee();
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
      }, 3000);
    }
  });
};

// Get and post routes here
// app.get (for each route - employees, departments, new employees, roles, employees roles, new departments, etc)
// Read all departments
app.get("/api/departments", (req, res) => {
  let server = true;
 viewDepartments(res, server);
});

// adding a new department
app.post("/api/new-departments", (req, res) => {
  let server = true;
  addDepartment(req, res, server);
});

// Read all employees
app.get("/api/employees", (req, res) => {
  let server = true;
 viewEmployees(res, server);
});

// Read all roles
app.get("/api/roles", (req, res) => {
  let server = true;
 viewRoles(res, server);
});

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