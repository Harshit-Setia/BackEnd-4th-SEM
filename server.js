const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const { authenticate } = require('./middleware/auth');
require('dotenv').config();

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// routes
// event routes
app.use('/api/events', authenticate, eventRoutes); 
// user route
app.use('/api/users', userRoutes); 

// server start
const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});