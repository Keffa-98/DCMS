var express = require("express");
const passport = require("passport");
var router = express.Router();
const { login, register } = require("../services/auth");
const { render } = require("ejs");

router.get("/signup", function (req, res) {
  res.render("auth/signup.njk", {
    title: "ACMS | SignUp",
    messages: req.flash(),
  });
});

router.post("/signup", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    const errors = {};
    if (email === "") {
      errors.email = "Email is required";
    }
    if (password === "") {
      errors.password = "Password is required";
    }
    if (errors.email || errors.password) {
      return render("auth/signup", { errors });
    }

    const user = await register(email, password);
    if (!user) {
      req.flash("error", "Registration failed. Please try again.");
    }
    req.flash(
      "success",
      "Account registered successfully. You can now log in."
    );
    res.redirect(302, "/auth/signin");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect(302, "/auth/signup");
  }
});

router.get("/signin", function (req, res) {
  res.render("auth/signin.njk", {
    title: "ACMS | SignIn",
    messages: req.flash(),
    next: req.query.next || "/dashboard",
  });
});

router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/auth/signin",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(req.body.next);
  }
);

router.get("/signout", function (req, res, next) {
  req.logout({}, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect(302, "/auth/signin");
  });
});

module.exports = router;
