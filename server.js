const express = require('express');
const connectDB=require('./config/db.js')
require('dotenv').config();


// Middleware
const app = express();
app.use(express.json()); 
connectDB();

// routes


// server start
const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});