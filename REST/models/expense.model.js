const { sql } = require("./db.js");
var moment = require("moment");

const Expense = function (expense) {
  this.amount = expense.amount;
  this.description = expense.description;
  this.category_id = expense.category_id;
  this.date = expense.date;
  this.username = expense.username;
};

Expense.getAllByUser = (username, result) => {
  sql.query(
    `SELECT e.*, c.name as category_name
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.username = '${username}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("expenses: ", res);
      result(null, res);
    }
  );
};

Expense.getExpensesByMonth = (username, year, month, result) => {
  sql.query(
    `SELECT e.*, c.name as category_name
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.username = '${username}' AND YEAR(e.date) = '${year}' AND MONTH(e.date) = '${month}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("expenses: ", res);
      result(null, res);
    }
  );
};

Expense.getCurrentMonthExpensesByCategory = (username, result) => {
  const startDate = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");

  let query = `SELECT c.name AS category_name, SUM(e.amount) AS total_amount
              FROM expenses e
              INNER JOIN categories c ON e.category_id = c.id
              WHERE e.username = '${username}'
              AND e.date >= '${startDate}' AND e.date <= '${endDate}'`;

  query += " GROUP BY c.id";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("expenses by category: ", res);
    result(null, res);
  });
};

Expense.getTotalExpensesByMonth = (username, result) => {
  let query = `SELECT DATE_FORMAT(date, '%M %Y') AS month, SUM(amount) AS total_amount
              FROM expenses
              WHERE username = '${username}'
              GROUP BY DATE_FORMAT(date, '%M %Y')
              ORDER BY MIN(date)`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("expenses by month: ", res);
    const resultObject = res.reduce((acc, { month, total_amount }) => {
      acc[month] = total_amount;
      return acc;
    }, {});

    result(null, resultObject);
  });
};

Expense.create = (newExpense, result) => {
  sql.query("INSERT INTO expenses SET ?", newExpense, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created expense: ", { id: res.insertId, ...newExpense });
    result(null, { id: res.insertId, ...newExpense });
  });
};

Expense.update = (id, expense, result) => {
  sql.query(
    "UPDATE expenses SET amount = ?, description = ?, category_id = ?, date = ? WHERE id = ?",
    [
      expense.amount,
      expense.description,
      expense.category_id,
      expense.date,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated expense: ", { id: id, ...expense });
      result(null, { id: id, ...expense });
    }
  );
};

Expense.delete = (id, result) => {
  sql.query("DELETE FROM expenses WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted expense with id: ", id);
    result(null, res);
  });
};

module.exports = Expense;
