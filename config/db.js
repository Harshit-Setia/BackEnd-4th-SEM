const mongoose = require('mongoose')

const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.MongoDB_URI)
        console.log("DB connected")
    } catch (error) {
        console.log("MongoDB Connection faild : ", error);
        process.exit(1)
    }
}

module.exports = connectDB