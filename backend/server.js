const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const path = require('path');

// Import Firestore (NoSQL) and MySQL (SQL)
const { db: firestoreDB } = require('./config/firebase'); // Firestore
const db = require('./config/db'); // MySQL

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(bodyParser.json()); // ✅ Required to parse JSON body

// Debugging: Check if server receives requests
app.use((req, res, next) => {
    console.log(`📥 Received request: ${req.method} ${req.url}`);
    next();
});

// ✅ Route to ADD new equipment (MySQL)
app.post('/api/equipment', (req, res) => {
    console.log("🔹 Received data:", req.body);
    const { name, category, quantity, status } = req.body;

    if (!name || !category || !quantity || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO equipment (name, category, quantity, status) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, category, quantity, status], (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "✅ Equipment added successfully", id: result.insertId });
    });
});

// ✅ Route to GET equipment (MySQL)
app.get('/api/equipment', (req, res) => {
    db.query("SELECT * FROM equipment", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ✅ Route to GET equipment from Firestore (NoSQL)
app.get('/api/test-firestore', async (req, res) => {
    try {
        console.log("🔥 Fetching data from Firestore...");
        if (!firestoreDB) {
            console.error("❌ Firestore not initialized properly!");
            return res.status(500).json({ error: "Firestore connection failed" });
        }

        const snapshot = await firestoreDB.collection("equipment").get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No equipment found in Firestore" });
        }

        let data = [];
        snapshot.forEach(doc => {
            let docData = doc.data();

            // 🛠 Fix Data Issues
            let cleanedData = {
                id: doc.id,
                name: docData.name?.replace(/^"(.*)"$/, '$1'), // Removes unnecessary quotes
                category: docData.category?.trim() || "Unknown", // Removes spaces/tabs, sets default if missing
                quantity: docData.quantity !== undefined ? Number(docData.quantity) : 0, // Ensures it's a number, defaults to 0
                status: docData.status?.replace(/^"(.*)"$/, '$1') || "Unknown", // Removes quotes, sets default
                location: docData.location || { lat: 0, lng: 0 } // Default location if missing
            };

            data.push(cleanedData);
        });

        console.log("✅ Firestore Data:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Firestore Error:", error);
        res.status(500).send(error.message);
    }
});

// ✅ Route to execute Python script for optimized allocation
app.get('/api/optimized-allocation', (req, res) => {
    console.log("🔄 Running medical equipment allocation script...");

    const pythonScriptPath = path.join(__dirname, 'scripts/equipment_allocation.py');

    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Python Execution Error: ${error}`);
            return res.status(500).json({ error: "Python script execution failed" });
        }
        if (stderr) {
            console.error(`⚠️ Python Script Stderr: ${stderr}`);
        }

        try {
            const outputData = JSON.parse(stdout); // Convert Python output to JSON
            console.log("✅ Optimized Allocation Data:", outputData);
            res.json(outputData);
        } catch (parseError) {
            console.error("❌ JSON Parsing Error:", parseError);
            res.status(500).json({ error: "Invalid JSON output from Python script" });
        }
    });
});


app.get('/api/allocate-equipment', (req, res) => {
    console.log("🔄 Running medical equipment allocation script...");

    const pythonScriptPath = path.join(__dirname, 'scripts/equipment_allocation.py');

    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Python Execution Error: ${error.message}`);
            return res.status(500).json({ error: `Python script execution failed: ${error.message}` });
        }
        if (stderr) {
            console.error(`⚠️ Python Script Stderr: ${stderr}`);
        }

        console.log("✅ Python Script Output:", stdout);
        res.json({ message: "Optimized allocation generated", output: stdout });
    });
});



// ✅ Real-time updates using Socket.io
io.on('connection', (socket) => {
    console.log("⚡ New client connected:", socket.id);

    socket.on('disconnect', () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
