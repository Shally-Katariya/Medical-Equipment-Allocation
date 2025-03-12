const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createPool({
    connectionLimit: 10, // Allow up to 10 concurrent connections
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'MedicalEquipmentDB'
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database');
        connection.release(); // Release connection
    }
});

module.exports = db;
