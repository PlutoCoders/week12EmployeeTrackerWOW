// Use class constructor here
class Employee {
    constructor(employeeObj) {
      Object.assign(this, employeeObj);
    }
  }
  
  module.exports = Employee;