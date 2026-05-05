const axios = require("axios");

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function getNotifications() {
  const res = await axios.get(`${BASE_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return res.data.notifications;
}

function calculateScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const time = new Date(notification.Timestamp).getTime();

  return weight * 1000000000000 + time;
}

function getTopKNotifications(notifications, k = 10) {
  return notifications
    .map((n) => ({
      ...n,
      score: calculateScore(n),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

async function runPrioritySystem() {
  try {
    const notifications = await getNotifications();

    const topNotifications = getTopKNotifications(notifications, 10);

    console.log("Top Priority Notifications:\n");

    topNotifications.forEach((n, index) => {
      console.log(
        `${index + 1}. [${n.Type}] ${n.Message} (${n.Timestamp})`
      );
    });

  } catch (err) {
    console.error("Error:", err.message);
  }
}

module.exports = runPrioritySystem;