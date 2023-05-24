const { sql } = require("./db.js");

const Category = function (name, username) {
  this.name = name;
  this.username = name;
};

Category.getCategories = (username, result) => {
  sql.query(
    `SELECT * FROM categories WHERE username = '${username}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("found categories: ", res);
      result(null, res);
      return;
    }
  );
};

Category.create = (name, username, result) => {
  // create category
  const category = { name: name, username: username };
  sql.query("INSERT INTO categories SET ?", category, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created category: ", { id: res.insertId, ...category });
    result(null, res);
  });
};

Category.updateName = (id, name, result) => {
  sql.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
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

      console.log("updated category: ", { id: id, name: name });
      result(null, { id: id, name: name });
    }
  );
};

Category.delete = (id, result) => {
  sql.query("DELETE FROM categories WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted category with id: ", id);
    result(null, res);
  });
};

module.exports = Category;
