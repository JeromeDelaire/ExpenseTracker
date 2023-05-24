var express = require("express");
var router = express.Router();
const User = require("../models/user.model.js");

router.get("/users", function (req, res, next) {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
});

router.get("/user/:username", function (req, res, next) {
  const username = req.params.username;
  User.findByUsername(username, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || `Error retrieving user with username ${username}.`,
      });
    else res.send(data);
  });
});

router.get("/user/mail/:mail", function (req, res, next) {
  const mail = req.params.mail;
  User.findByMail(mail, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || `Error retrieving user with mail ${mail}.`,
      });
    else res.send(data);
  });
});

router.post("/user", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    username: req.body.username,
    mail: req.body.mail,
    password: req.body.password,
  });

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    else res.send(data);
  });
});

router.post("/user/password", function (req, res, next) {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  User.checkPassword(user.username, user.password, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while checking password.",
      });
    else {
      if (!data) return res.send("Incorrect username or password");
      else {
        User.updatePassword(
          user.username,
          req.body.newPassword,
          (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while updating password.",
              });
            else {
              res.status(200).send("Password updated");
            }
          }
        );
      }
    }
  });
});

module.exports = router;
