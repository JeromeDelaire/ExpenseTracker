var express = require("express");
var router = express.Router();
const db = require("../models/db.js");
var clients = [];

db.setEventCallback((update) => {
  sendEvents(update);
});

router.get("/events", function (req, res) {
  addClient(req, res);
});

function addClient(req, res) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res: res,
    needPing: true,
  };
  clients.push(newClient);

  var pingTask = setInterval(function () {
    clients.forEach((client) => {
      if (client.id === clientId) {
        if (client.needPing) {
          client.res.write(`data: ping\n\n`);
        } else {
          client.needPing = true;
        }
      }
    });
  }, 30 * 1000);

  req.on("close", () => {
    clearInterval(pingTask);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function sendEvents(update) {
  var data = JSON.stringify(update);
  clients.forEach((client) => {
    client.res.write(`data: ${data}\n\n`);
    client.needPing = false;
  });
}

module.exports = router;
