const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./connections/dbConnection");
const userRouter = require("./Routes/userRoutes");
const  superadminroute = require('./Routes/superAdminRoutes')
const port = 5000 || process.env.port;
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/api/users", userRouter);
app.use('/api/super-admin',superadminroute)

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
