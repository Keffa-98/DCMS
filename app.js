var createError = require("http-errors");
var express = require("express");
const nunjucks = require("nunjucks");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const flash = require("connect-flash");
const dateFilter = require("nunjucks-date-filter");
require("./db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const clientRouter = require("./routes/clients");
const adminRouter = require("./routes/admin");
const AuthMiddleware = require("./middleware/auth.middleware");
const supportWorkerRouter = require("./routes/supportworker");
const tasksRouter = require("./routes/tasks");
const abbreviation = require("./filters/abbreviation");
const randomColor = require("./filters/randomColor");

var app = express();

// view engine setup

const env = nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
dateFilter.setDefaultFormat("ddd, MMM Do YYYY, hh:mm:ss");
env.addFilter("date", dateFilter);
env.addFilter("abbreviation", abbreviation);
env.addFilter("randomColor", randomColor);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  require("express-session")({
    secret: "18f4e2b746ed8b07443d144ffd82aa1a05d5cddd6bdfaf81",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
    },
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport.js configuration
require("./passport")(passport);

app.use("/", indexRouter);
app.use("/users", AuthMiddleware, usersRouter);
app.use("/auth", authRouter);
app.use("/clients", AuthMiddleware, clientRouter);
app.use("/supportworkers", AuthMiddleware, supportWorkerRouter);
app.use("/admin", AuthMiddleware, adminRouter);
app.use("/tasks", tasksRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  console.log({ err });

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status === 404) {
    res.render("errors/404", { error: err, title: 404 });
  } else if (err.status === 403) {
    res.render("errors/403", { error: err, title: 404 });
  } else {
    res.render("errors/500", { error: err, title: 500 });
  }
});

app.listen();

module.exports = app;
