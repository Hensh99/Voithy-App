const express = require("express");
const morgan = require("morgan");

const patientRouter = require("./routes/patientRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json()); // middleware :function to modify the incoming request data

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
