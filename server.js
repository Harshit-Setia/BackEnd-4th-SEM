const express = require('express');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const { authenticate } = require('./middleware/auth');
const connectDB=require('./config/db.js')
require('dotenv').config();


// Middleware
const app = express();
app.use(express.json()); 
connectDB();

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