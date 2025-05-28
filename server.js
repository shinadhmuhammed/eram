const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./connections/dbConnection')

const port = 5000 || process.env.dotenv

const app = express()
dotenv.config();


connectDB()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(error => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    });