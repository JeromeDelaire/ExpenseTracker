require("dotenv").config();

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
fs = require("fs");
var path = require("path");
const crypto = require("crypto");
var session = require("express-session");
var passport = require("passport");

var usersRouter = require("./routes/users");
var categoriesRouter = require("./routes/categories");
var expensesRouter = require("./routes/expenses");
var incomesRouter = require("./routes/incomes");
var eventsRouter = require("./routes/events");
var authRouter = require("./routes/auth");
var expenseTrackerRouter = require('./routes/expense-tracker')
var app = express();

// view engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'public/expense-tracker-dist')]);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("morgan")("combined"));
app.use(bodyParser.json());
app.set("trust_proxy", true);
app.use(express.static(path.join(__dirname, "public")));
app.use('/expense-tracker/', express.static(path.join(__dirname, 'public/expense-tracker-dist')));
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate("session"));

if (
  process.env.CERTIFICATE_KEY !== undefined &&
  process.env.CERTIFICATE_KEY != "" &&
  process.env.CERTIFICATE_CRT != undefined &&
  process.env.CERTIFICATE_CRT !== ""
) {
  var https = require("https");
  var options = {
    key: fs.readFileSync(process.env.CERTIFICATE_KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE_CRT),
  };
  https.createServer(options, app).listen(process.env.PORT, function () {});
} else {
  app.listen(process.env.PORT);
}

app.use(function (req, res, next) {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http: https:; script-src 'self' 'nonce-" +
      res.locals.nonce +
      "'"
  );

  next();
});

// app.all('*', function(req,res,next){
//   if (req.path.startsWith('/login')) {
//     next();
//   }
//   else if(!req.user) {
//     return res.redirect('/login');
//   } else {
//     next();
//   }
// });

app.use("/", authRouter);
app.use("/", usersRouter);
app.use("/", categoriesRouter);
app.use("/", expensesRouter);
app.use("/", incomesRouter);
app.use("/", eventsRouter);
app.use("/", expenseTrackerRouter);

module.exports = app;
