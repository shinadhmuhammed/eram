const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB at: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = connectDB;   