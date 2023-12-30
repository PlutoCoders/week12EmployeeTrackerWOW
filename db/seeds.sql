USE employes_db;

INSERT INTO department (name)
VALUES ("War"),
       ("Security"),
       ("Justice"),
       ("Health"),
       ("State");

INSERT INTO role (title, salary, department_id)
VALUES 
        (Chief, 100000, 1),
        (Magistrate, 75000, 2),
        (Warden, 85000, 3),
        (Minister, 90000, 4),
        (King, 80000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy", "Jones", 1, 1),
       ("Tim", "Bones", 2, 2),
       ("Billy", "Rowes", 3, 3),
       ("Shelly", "Dole", 4, 4),
       ("Kelly", "Knowles", 5, 5);

    --    12 SQL 08
       