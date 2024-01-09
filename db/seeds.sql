USE employees_db;

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


INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES ("Jimmy", "Jones", 1, 1),
       ("Tim", "Bones", 2, 2),
       ("Billy", "Rowes", 3, 3),
       ("Shelly", "Dole", 4, 4),
       ("Kelly", "Knowles", 1, 2);
       ("Daman", "Dodicky", 5, 3);
       ("Shawn", "Mikaels", 1, 4);
       ("John", "Cenar", 3, 2);
       ("Hulk", "Howgan", 1, 3);
       ("Mr.Under", "Taker", 2, 4);
       ("StoneCold", "SteveAustin", 1, 2);

    --    12 SQL 08
       