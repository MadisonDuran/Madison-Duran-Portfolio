const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory (Frontend, Images, etc.)
app.use(express.static(path.join(__dirname, '..')));
app.use('/Frontend', express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/Images', express.static(path.join(__dirname, '..', 'Images')));

// Database setup
const dbPath = path.join(__dirname, 'portfolio.db');
let db;

// Initialize database
initSqlJs().then(SQL => {
    let buffer;
    if (fs.existsSync(dbPath)) {
        buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('✓ Existing database loaded');
    } else {
        db = new SQL.Database();
        console.log('✓ New database created');
    }

    // Create tables if they don't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            consent INTEGER NOT NULL DEFAULT 0,
            submission_date TEXT DEFAULT (datetime('now')),
            ip_address TEXT,
            user_agent TEXT,
            status TEXT DEFAULT 'new',
            notes TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS contact_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER NOT NULL,
            response_date TEXT DEFAULT (datetime('now')),
            response_text TEXT NOT NULL,
            responded_by TEXT,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
        );
    `);

    // Save initial database
    saveDatabase();
    console.log('✓ Database initialized successfully at:', dbPath);
}).catch(err => {
    console.error('✗ Database initialization failed:', err);
});

// Function to save database to disk
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// POST endpoint for contact form submission
app.post('/api/contact', (req, res) => {
    const { firstName, lastName, email, message, consent } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !message || !consent) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required including consent'
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    try {
        // Get client IP and user agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        db.run(
            `INSERT INTO contacts (first_name, last_name, email, message, consent, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, message, consent ? 1 : 0, ipAddress, userAgent]
        );

        // Get the last inserted ID
        const result = db.exec('SELECT last_insert_rowid() as id');
        const contactId = result[0].values[0][0];

        // Save database to disk
        saveDatabase();

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            contactId: contactId
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
});

// GET endpoint to retrieve all contacts (for admin purposes)
app.get('/api/contacts', (req, res) => {
    try {
        const result = db.exec('SELECT * FROM contacts ORDER BY submission_date DESC');
        
        let contacts = [];
        if (result.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values;
            contacts = values.map(row => {
                const contact = {};
                columns.forEach((col, index) => {
                    contact[col] = row[index];
                });
                return contact;
            });
        }

        res.json({
            success: true,
            contacts: contacts
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contacts'
        });
    }
});

// GET endpoint to retrieve a single contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const { id } = req.params;

    try {
        const result = db.exec('SELECT * FROM contacts WHERE id = ?', [id]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        const columns = result[0].columns;
        const row = result[0].values[0];
        const contact = {};
        columns.forEach((col, index) => {
            contact[col] = row[index];
        });

        res.json({
            success: true,
            contact: contact
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contact'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint - Welcome message
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Madison Duran Portfolio API',
        version: '1.0.0',
        endpoints: {
            contact: 'POST /api/contact - Submit contact form',
            contacts: 'GET /api/contacts - Get all contacts',
            contactById: 'GET /api/contacts/:id - Get contact by ID',
            health: 'GET /api/health - Health check'
        },
        status: 'API is running successfully'
    });
});

// Serve other HTML pages
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, '..', 'Frontend', 'HTML files', page));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ API endpoint: http://localhost:${PORT}/api/contact`);
});

module.exports = app;
