# 🧙‍♂️ StaffSage - Your Magical Employee Management System

> *"Because managing employees shouldn't feel like casting a complex spell!"* ✨

## 📋 Overview

Welcome to StaffSage, a command-line wizard's tool for managing your company's magical workforce! This application helps business owners (and aspiring wizards) view and manage their departments, roles, and employees with the power of Node.js, Inquirer, and PostgreSQL.

## 🎯 Features

### Core Spells (Features) 🪄
- View all departments
- View all roles
- View all employees
- Add new departments
- Add new roles
- Add new employees
- Update employee roles

### Bonus Magic ✨
- Update employee managers
- View employees by manager
- View employees by department
- Delete departments, roles, and employees
- View department budget (total salary utilization)

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your magical device
- PostgreSQL database
- A sprinkle of coding knowledge

### Installation Steps

1. Clone this repository:
```bash
git clone https://github.com/KnifeDad/StaffSage.git
```

2. Navigate to the project directory:
```bash
cd StaffSage
```

3. Install the required packages:
```bash
npm install
```

4. Set up your database:
   - Create a `.env` file with your database credentials
   - Run the schema.sql file in your PostgreSQL database

5. Start the application:
```bash
npm start
```

## 🎥 Demo

[![StaffSage Demo](./assets/staffsage-preview.png)](https://drive.google.com/file/d/1WJyaIihHer1PT2ilchA-ETeh_-2aD22p/view)

Watch the full walkthrough video: [Video Link](https://drive.google.com/file/d/1WJyaIihHer1PT2ilchA-ETeh_-2aD22p/view)

## 🏗️ Database Schema

The application uses three main tables:

### Department Table
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(30) UNIQUE NOT NULL

### Role Table
- `id`: SERIAL PRIMARY KEY
- `title`: VARCHAR(30) UNIQUE NOT NULL
- `salary`: DECIMAL NOT NULL
- `department_id`: INTEGER NOT NULL

### Employee Table
- `id`: SERIAL PRIMARY KEY
- `first_name`: VARCHAR(30) NOT NULL
- `last_name`: VARCHAR(30) NOT NULL
- `role_id`: INTEGER NOT NULL
- `manager_id`: INTEGER

## 🛠️ Built With
- Node.js
- Inquirer
- PostgreSQL
- Console.table

## 👨‍💻 Author
- **KnifeDad** - *Initial work* - [GitHub Profile](https://github.com/KnifeDad)

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- Thanks to all the magical developers who created the amazing packages used in this project
- Special thanks to the coding community for their endless support and inspiration

---
*Made with ❤️ and a sprinkle of magic by KnifeDad* 