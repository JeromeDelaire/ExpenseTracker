const { sql } = require("./db.js");

const Income = function (expense) {
  this.amount = expense.amount;
  this.description = expense.description;
  this.date = expense.date;
  this.user_name = expense.user_name;
};

Income.getAllByUser = (username, result) => {
  sql.query(
    `SELECT * FROM incomes WHERE username = '${username}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("incomes: ", res);
      result(null, res);
    }
  );
};

Income.getByMonth = (username, year, month, result) => {
  sql.query(
    `SELECT * FROM incomes
    WHERE username = '${username}' AND YEAR(date) = '${year}' AND MONTH(date) = '${month}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("incomes : ", res);
      result(null, res);
    }
  );
};

Income.getTotalIncomesByMonth = (username, result) => {
  let query = `SELECT DATE_FORMAT(date, '%M %Y') AS month, SUM(amount) AS total_amount
              FROM incomes
              WHERE username = '${username}'
              GROUP BY DATE_FORMAT(date, '%M %Y')
              ORDER BY MIN(date)`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("incomes by month: ", res);
    const resultObject = res.reduce((acc, { month, total_amount }) => {
      acc[month] = total_amount;
      return acc;
    }, {});

    result(null, resultObject);
  });
};

Income.create = (newIncome, result) => {
  sql.query("INSERT INTO incomes SET ?", newIncome, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created income: ", { id: res.insertId, ...newIncome });
    result(null, { id: res.insertId, ...newIncome });
  });
};

Income.update = (id, income, result) => {
  sql.query(
    "UPDATE incomes SET amount = ?, description = ?, date = ? WHERE id = ?",
    [income.amount, income.description, income.date, id],
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

      console.log("updated income: ", { id: id, ...income });
      result(null, { id: id, ...income });
    }
  );
};

Income.delete = (id, result) => {
  sql.query("DELETE FROM incomes WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted income with id: ", id);
    result(null, res);
  });
};

module.exports = Income;
