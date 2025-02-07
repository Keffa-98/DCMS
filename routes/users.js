var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { register } = require("../services/auth");

const prisma = new PrismaClient();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    res.render("users/users-list", {
      users,
      title: "DCMS |Users List",
      user: req.user,
    });
  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/new", function (req, res, next) {
  res.render("users/add-user", { title: "Create User", user: req.user });
});

/* Post create user */
router.post("/new", async function (req, res, next) {
  var body = req.body;
  console.log({ body });

  const errors = {};
  if (body.email === "") {
    errors.email = "Email is required";
  }
  if (body.password === "") {
    errors.password = "Password is required";
  }
  console.log(body.role);

  if (body.role === "") {
    errors.role = "Role is required";
  }
  if (errors.email || errors.password || errors.role) {
    return res.render("users/add-user", {
      title: "Create User",
      errors,
      form: body,
      user: req.user,
    });
  }
  try {
    await register(body.email, body.password, body.role);
    res.redirect("/users");
  } catch (error) {
    res.render("users/add-user", {
      title: "Create User",
      error,
      form: body,
      user: req.user,
    });
  }
});

module.exports = router;
