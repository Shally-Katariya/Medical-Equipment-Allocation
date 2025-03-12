const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch all equipment allocations
router.get('/', (req, res) => {
    db.query('SELECT * FROM allocations', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Add new allocation
router.post('/', (req, res) => {
    const { equipment_id, hospital_id, quantity } = req.body;
    const sql = 'INSERT INTO allocations (equipment_id, hospital_id, quantity) VALUES (?, ?, ?)';
    
    db.query(sql, [equipment_id, hospital_id, quantity], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Allocation added successfully' });
    });
});

module.exports = router;
