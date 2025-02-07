var express = require("express");
var router = express.Router();
const usersService = require("../services/users");
const clientsService = require("../services/clients");
const supportWorkersService = require("../services/supportworker");
const taskService = require("../services/tasks");
const AuthMiddleware = require("../middleware/auth.middleware");
const { Role } = require("@prisma/client");

/* GET Home Page. */
router.get("/", function (req, res) {
  res.render("home.njk", { title: "DCMS | Home" });
});

/* GET Dashboard. */
router.get("/dashboard", AuthMiddleware, async function (req, res) {
  console.log(req.user);
  const users = await usersService.find();
  const userCount = await usersService.count();
  const clientsCount = await clientsService.count(
    req.user.role === Role.ADMIN ? null : req.user.id
  );
  const supportWorkersCount = await supportWorkersService.count();
  let clients;
  let tasks;
  if (req.user.role === Role.ADMIN) {
    clients = await clientsService.recent();
    tasks = await taskService.find();
  } else {
    clients = await clientsService.supportWorkerClients(req.user.id);
    tasks = await taskService.find(req.user.id);
  }
  const supportWorkers = await supportWorkersService.recent();
  res.render("dashboard.njk", {
    title: "DCMS | Dashboard",
    user: req.user,
    userCount,
    clientsCount,
    supportWorkersCount,
    supportWorkers,
    clients,
    users,
    tasks,
  });
});

module.exports = router;
