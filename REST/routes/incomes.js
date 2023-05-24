var express = require("express");
var router = express.Router();
const Income = require("../models/income.model.js");

// Get all incomes for a user
router.get("/incomes/:username", function (req, res, next) {
  const username = req.params.username;
  Income.getAllByUser(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving incomes for user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/incomes/:username/:year/:month", function (req, res, next) {
  const username = req.params.username;
  const year = req.params.year;
  const month = req.params.month;
  Income.getByMonth(username, year, month, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving incomes by month for user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/totalIncomesByMonth/:username", function (req, res, next) {
  const username = req.params.username;
  Income.getTotalIncomesByMonth(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving total incomes for a year for user with username ${username}.`,
      });
    else res.send(data);
  });
});

// Create an income
router.post("/income", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const income = {
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date,
    username: req.body.username,
  };

  Income.create(income, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Income.",
      });
    else res.send(data);
  });
});

// Update an income
router.post("/income/update", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const income = {
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date,
  };

  Income.update(req.body.id, income, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the Income.",
      });
    else res.send(data);
  });
});

// Delete an income
router.delete("/income/:id", function (req, res, next) {
  Income.delete(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the Income.",
      });
    else res.send(data);
  });
});

module.exports = router;
