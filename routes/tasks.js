const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/auth.middleware");
const { Role } = require("@prisma/client");

const tasksService = require("../services/tasks");
const supportworkerService = require("../services/supportworker");
const createHttpError = require("http-errors");

router.use(AuthMiddleware);

router.get("", async (req, res, next) => {
  var tasks;
  if (req.user.role === Role.ADMIN) {
    tasks = await tasksService.find();
  } else {
    tasks = await tasksService.find(req.user.id);
  }

  return res.render("tasks/task-list", { tasks, user: req.user });
});

router.get("/new", async (req, res) => {
  const supportworkers = await supportworkerService.find();
  return res.render("tasks/add-task", { user: req.user, supportworkers });
});

router.post("/new", async (req, res, next) => {
  try {
    const body = req.body;
    const errors = validateTaskForm(body);
    if (errors.description || errors.due || errors.workerId) {
      return res.render("tasks/add-task", { user: req.user, supportworkers });
    }
    const newTask = {
      description: body.description,
      dueDate: new Date(body.due),
      supportWorkerId: body.workerId,
    };
    await tasksService.create(newTask);
    return res.redirect("/tasks");
  } catch (error) {
    return next(createHttpError(500, error));
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const task = await tasksService.findOne(req.params.id);
    console.log({ task });

    if (!task) {
      return next(createHttpError(404, "Task not Found"));
    }
    return res.render("tasks/task", { user: req.user, task });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
});
router.get("/:id/complete", async (req, res, next) => {
  try {
    await tasksService.completeTask(req.user.id, req.params.id);
    return res.redirect(`/tasks/${req.params.id}`);
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
});



function validateTaskForm(body) {
  const errors = {};
  if (body.description === "") {
    errors.description = "Description is required!";
  }
  if (body.due === "") {
    errors.due = "Due Date is required!";
  }
  if (body.workerId === "") {
    errors.workerId = "Support Worker is Required";
  }
  return errors;
}

module.exports = router;
