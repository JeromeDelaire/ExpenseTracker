var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
const Credential = require("../models/credentials.model.js");
const User = require("../models/user.model.js");

var router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/login/redirect/google",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      console.log(profile)
      Credential.get(issuer, profile.id, (err, row) => {
        if (err) {
          return cb(err);
        }
        if (!row) {
          User.create(profile.displayName, (err, insertedUser) => {
            if (err) {
              return cb(err);
            }
            var id = insertedUser.id;
            Credential.create(id, issuer, profile.id, (err, _) => {
              if (err) {
                console.log('err')
                return cb(err);
              }
              var user = {
                id: id,
                name: profile.displayName,
              };
              return cb(null, user);
            });
          });
        } else {
          User.get(row.user_id, (err, row) => {
            if (err) {
              return cb(err);
            }
            if (!row) {
              return cb(null, false);
            }
            return cb(null, row);
          });
        }
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get('/login/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.sendStatus(200)
    });
  });

module.exports = router;
