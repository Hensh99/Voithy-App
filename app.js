const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const patientRouter = require("./routes/patientRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARE

// For security HTTP Headers
app.use(helmet());

// Development Logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// To avoid Brute Force attack or DNS [Limit Request]
const limiter = rateLimit({
  max: 100, // 100 request for the same IP
  windowMs: 60 * 60 * 1000, // 1 Hour
  message:
    "Alert, Too many request from the same IP Address, try again after an hour.",
});
app.use("/api", limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" })); // middleware :function to modify the incoming request data

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
