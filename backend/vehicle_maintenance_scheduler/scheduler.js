const axios = require("axios");
const Log = require("../logging_middleware/logger");

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN || "YOUR_TOKEN_HERE";

async function getDepots() {
  try {
    Log("backend", "info", "service", "Fetching depots");

    const res = await axios.get(`${BASE_URL}/depots`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return res.data.depots;
  } catch (err) {
    Log("backend", "error", "service", `Depot API failed: ${err.message}`);
    throw err;
  }
}

async function getVehicles() {
  try {
    Log("backend", "info", "service", "Fetching vehicles");

    const res = await axios.get(`${BASE_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return res.data.vehicles;
  } catch (err) {
    Log("backend", "error", "service", `Vehicle API failed: ${err.message}`);
    throw err;
  }
}

function knapsackWithSelection(tasks, capacity) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for(let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for(let w = 0; w <= capacity; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          Impact + dp[i - 1][w - Duration],
          dp[i - 1][w]
        );
      }else{
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  const selectedTasks = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const task = tasks[i - 1];
      selectedTasks.push(task.TaskID);
      w -= task.Duration;
    }
  }

  return {
    maxImpact: dp[n][capacity],
    selectedTasks: selectedTasks.reverse(),
  };
}

async function runScheduler() {
  try {
    Log("backend", "info", "service", "Scheduler started");

    const depots = await getDepots();
    const vehicles = await getVehicles();

    Log(
      "backend",
      "debug",
      "service",
      `Fetched ${depots.length} depots and ${vehicles.length} tasks`
    );

    const results = [];

    for (const depot of depots) {
      const capacity = depot.MechanicHours;

      Log(
        "backend",
        "info",
        "service",
        `Processing depot ${depot.ID} with ${capacity} hours`
      );

      const result = knapsackWithSelection(vehicles, capacity);

      results.push({
        depotId: depot.ID,
        maxImpact: result.maxImpact,
        selectedTasks: result.selectedTasks,
      });

      console.log("=================================");
      console.log(`Depot ID: ${depot.ID}`);
      console.log(`Max Impact: ${result.maxImpact}`);
      console.log(`Selected Tasks:`, result.selectedTasks);
    }

    Log("backend", "info", "service", "Scheduler completed");

    return results;
  } catch (err) {
    Log("backend", "fatal", "service", `Scheduler failed: ${err.message}`);
  }
}

module.exports = runScheduler;