DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
-- -- See/check if database in use --
-- This doesn't seem to work
-- SELECT DATABASE(employees_db);
USE employees_db;


-- Creates the table "department" within employees_db --
CREATE TABLE departments (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(100) NOT NULL
  -- Department Name
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(30) NOT NULL,
    -- to hold role title

    salary DECIMAL NOT NULL,
    -- to hold role salary

    department_id INT NOT NULL
    -- to hold reference to department role belongs to
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(30) NOT NULL , 
    -- to hold employee first name

    last_name VARCHAR(30) NOT NULL,
    -- to hold employee last name

    manager_id INT NOT NULL,
    --  to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)
    
    role_id INT NOT NULL
    -- to hold reference to employee role
);

-- Delete Commands
-- DELETE FROM produce
-- WHERE id = 2;

-- Update Commands
-- UPDATE produce
-- SET name = "strawberry"
-- WHERE id = 1;

SELECT DATABASE();