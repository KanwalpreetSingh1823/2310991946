const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

const requestLogger = require("./logging_middleware/requestLogger");
const Log = require("./logging_middleware/logger");
const runScheduler = require("./vehicle_maintenance_scheduler/scheduler");
const runPrioritySystem = require("./notification_app_be/priorityNotifications");

dotenv.config();

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  Log("backend", "info", "route", "Health check route hit");
  res.send("Server is running...");
});

app.get("/api/test", async (req, res) => {
  try {
    Log("backend", "debug", "controller", "Test API called");

    const data = { message: "Test successful" };

    Log("backend", "info", "service", "Test API executed successfully");

    res.status(200).json(data);
  } catch (err) {
    Log("backend", "error", "controller", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.use((req, res) => {
  Log(
    "backend",
    "warn",
    "route",
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  Log(
    "backend",
    "fatal",
    "handler",
    `Unhandled error: ${err.message}`
  );

  res.status(500).json({
    error: "Internal Server Error",
  });
});

runScheduler();
runPrioritySystem();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  Log("backend", "info", "service", `Server started on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});