const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const STACKS = ["backend", "frontend"];
const LEVELS = ["debug", "info", "warn", "error", "fatal"];
const PACKAGES = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

const AUTH_TOKEN = process.env.AUTH_TOKEN;

async function Log(stack, level, pkg, message) {
  try {

    if (!STACKS.includes(stack)) {
      throw new Error("Invalid stack");
    }
    if (!LEVELS.includes(level)) {
      throw new Error("Invalid level");
    }
    if (!PACKAGES.includes(pkg)) {
      throw new Error("Invalid package");
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString()
    };

    await axios.post(LOG_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = Log;