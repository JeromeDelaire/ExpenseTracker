const { sql } = require("./db.js");

const User = function (user) {
  this.username = user.username;
  this.mail = user.mail;
  this.password = user.password;
};

User.getAll = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.findByUsername = (username, result) => {
  sql.query(
    `SELECT * FROM users WHERE username = '${username}'`,
    (err, res) => {
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
    }
  );
};

User.findByMail = (mail, result) => {
  sql.query(`SELECT * FROM users WHERE mail = '${mail}'`, (err, res) => {
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

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.checkPassword = (username, password, result) => {
  sql.query(
    "SELECT password FROM users WHERE username = ?",
    username,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        const storedPassword = res[0].password;
        if (password === storedPassword) {
          result(null, true);
        } else {
          result(null, false);
        }
      } else {
        result(null, false);
      }
    }
  );
};

User.updatePassword = (username, newPassword, result) => {
  sql.query(
    "UPDATE users SET password = ? WHERE username = ?",
    [newPassword, username],
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

      console.log("updated user password: ", { username: username });
      result(null, { username: username });
    }
  );
};

module.exports = User;
