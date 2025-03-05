// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const { authenticate } = require('./middleware/auth'); // Import the correct function
require('dotenv').config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use('/api/events', authenticate, eventRoutes); // Protect event routes
app.use('/api/users', userRoutes); // User routes may or may not need auth.

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});