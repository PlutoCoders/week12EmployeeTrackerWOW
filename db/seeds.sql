INSERT INTO department (name)
VALUES ("War"),
       ("Security"),
       ("Justice"),
       ("Health"),
       ("State");

INSERT INTO role (title, salary, department_id)
VALUES (Chief, 50000, 1),
       (King, 50000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("War"),
       ("Security"),
       ("Justice"),
       ("Health"),
       ("State");
       