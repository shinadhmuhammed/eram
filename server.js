const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connections/dbConnection");
const userRouter = require("./Routes/userRoutes");
const port = 5000 || process.env.dotenv;
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
