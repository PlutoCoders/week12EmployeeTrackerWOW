INSERT INTO departments (name)
VALUES ("War"),
       ("Security"),
       ("Justice"),
       ("Health"),
       ("State");

INSERT INTO roles (title, salary, department_id)
VALUES 
        ("Chief", 100000, 1),
        ("Magistrate", 75000, 2),
        ("Warden", 85000, 3),
        ("Minister", 90000, 4),
        ("King", 80000, 5),
        ("Manager", 1000000, 5);
        


INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES ("Jimmy", "Jones", 11, 1),
       ("Tim", "Bones", 11, 2),
       ("Billy", "Rowes", 11, 3),
       ("Shelly", "Dole", 11, 4),
       ("Kelly", "Knowles", 11, 2),
       ("Daman", "Dodicky", 11, 3),
       ("Shawn", "Mikaels", 11, 4),
       ("John", "Cenar", 11, 2),
       ("Hulk", "Howgan", 11, 3),
       ("Mr.Under", "Taker", 11, 4),
       ("Mr.Glorbkins", "Sheefenheim", 2, 6),
       ("StoneCold", "SteveAustin", 11, 2);    