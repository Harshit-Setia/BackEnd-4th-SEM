const express = require('express');
const connectDB=require('./config/db.js')
const userRoute=require('./routes/userRoute.js')
const eventRoute=require('./routes/eventRoute.js')
require('dotenv').config();


// Middleware
const app = express();
app.use(express.json()); 
connectDB();

// routes
app.use('/api/users',userRoute)
app.use('/api/events',eventRoute)

// server start
const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});