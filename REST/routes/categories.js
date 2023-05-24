var express = require("express");
var router = express.Router();
const Category = require("../models/category.model.js");

router.get("/categories/:username", function (req, res, next) {
  const username = req.params.username;
  Category.getCategories(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || `Error retrieving user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.post("/category", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Category.create(req.body.name, req.body.username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category.",
      });
    else res.send(data);
  });
});

router.post("/category/update", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Category.updateName(req.body.id, req.body.name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the Category.",
      });
    else res.send(data);
  });
});

// Delete an category
router.delete("/category/:id", function (req, res, next) {
  Category.delete(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the Category.",
      });
    else res.send(data);
  });
});

module.exports = router;
