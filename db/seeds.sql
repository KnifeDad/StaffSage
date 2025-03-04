INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Software Engineer', 120000, 1),
    ('Lead Engineer', 150000, 1),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3),
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Guy', 'Ricketts', 2, NULL),
    ('Sebastian', 'Bonilla', 1, 1),
    ('Jonathan', 'Veliz', 3, NULL),
    ('Muhsina', 'Shinwari', 4, NULL),
    ('Matthew', 'Miller', 5, 4),
    ('Maurice', 'Lowery', 6, NULL),
    ('Hunter', 'Kyle', 7, 6),
    ('Devin', 'Menge', 1, 1),
    ('Felicia', 'Marshall', 7, 6),
    ('Steven', 'Agostisi', 5, 4); 