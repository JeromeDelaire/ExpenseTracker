var express = require("express");
var router = express.Router();
const Expense = require("../models/expense.model.js");

// Get all expenses for a user
router.get("/expenses/:username", function (req, res, next) {
  const username = req.params.username;
  Expense.getAllByUser(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving expenses for user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/expenses/:username/:year/:month", function (req, res, next) {
  const username = req.params.username;
  const year = req.params.year;
  const month = req.params.month;
  Expense.getExpensesByMonth(username, year, month, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving cureent month expenses for user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/totalExpensesByMonth/:username", function (req, res, next) {
  const username = req.params.username;
  Expense.getTotalExpensesByMonth(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving total expenses for a year for user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/expensesAmount/:username", function (req, res, next) {
  const username = req.params.username;
  Expense.getCurrentMonthExpensesByCategory(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Error retrieving total current month expenses for user with username ${username}.`,
      });
    else res.send(data);
  });
});

// Create an expense
router.post("/expense", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const expense = {
    amount: req.body.amount,
    description: req.body.description,
    category_id: req.body.category_id,
    date: req.body.date,
    username: req.body.username,
  };

  Expense.create(expense, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Expense.",
      });
    else res.send(data);
  });
});

// Update an expense
router.post("/expense/update", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const expense = {
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    category_id: req.body.category_id,
    date: req.body.date,
  };

  Expense.update(req.body.id, expense, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the Expense.",
      });
    else res.send(data);
  });
});

// Delete an expense
router.delete("/expense/:id", function (req, res, next) {
  Expense.delete(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the Expense.",
      });
    else res.send(data);
  });
});

module.exports = router;
