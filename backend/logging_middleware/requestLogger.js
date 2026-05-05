const Log = require("./logger");

function requestLogger(req, res, next) {
  Log("backend", "info", "route", `${req.method} ${req.url} hit`);
  next();
}

module.exports = requestLogger;