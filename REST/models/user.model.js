const { sql } = require("./db.js");

const User = function (username) {
  this.username = username;
};

User.get = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

User.create = (username, result) => {
  sql.query("INSERT INTO users (username) VALUES (?)", username, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, username });
    result(null, { id: res.insertId, username });
  });
};

module.exports = User;
