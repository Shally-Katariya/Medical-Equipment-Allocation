CREATE DATABASE MedicalEquipmentDB;
USE MedicalEquipmentDB;

CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    hospital_id INT,
    quantity INT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
INSERT INTO hospitals (name, location) VALUES ('Hospital A', 'New York');
INSERT INTO equipment (name, type) VALUES ('Ventilator', 'Respiratory');
INSERT INTO allocations (equipment_id, hospital_id, quantity) VALUES (1, 1, 10);
