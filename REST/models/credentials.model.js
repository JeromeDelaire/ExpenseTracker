const { sql } = require("./db.js");

const Credential = function (user_id, provider, subject) {
  this.user_id = user_id;
  this.provider = provider;
  this.subject = subject;
};

Credential.get = (provider, subject, result) => {
  sql.query(
    `SELECT * FROM federated_credentials WHERE provider = '${provider}' AND subject = '${subject}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("found crendential: ", res[0]);
      result(null, res[0]);
      return;
    }
  );
};

Credential.create = (user_id, provider, subject, result) => {
  console.log("try to created credentials")
  sql.query(
    "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
    [user_id, provider, subject],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created federated_credentials: ", {
        id: res.insertId,
        user_id,
      });
      result(null, { id: res.insertId, user_id });
    }
  );
};

module.exports = Credential;
