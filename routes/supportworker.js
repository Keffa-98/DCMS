const express = require("express");
const { RoleMiddleware } = require("../middleware/role.middleware");
const AuthMiddleware = require("../middleware/auth.middleware");
const { Role } = require("@prisma/client");
const router = express.Router();
const supportworkerService = require("../services/supportworker");
const adminService = require("../services/admin");

router.use(AuthMiddleware);
router.use(RoleMiddleware([Role.ADMIN]));

router.get("", async (req, res) => {
  try {
    const supportworkers = await supportworkerService.find();
    return res.render("supportworker/supportworker-list", {
      supportworkers,
      user: req.user,
    });
  } catch (error) {
    console.log({ error });
  }
});

router.get("/new", async (req, res, next) => {
  try {
    const supportworkers = await adminService.findSupportWorkerUsers();
    console.log({ supportworkers });

    return res.render("supportworker/add-supportworker", {
      supportworkers,
      user: req.user,
    });
  } catch (error) {
    console.log({ error });
  }
});
router.post("/new", async (req, res, next) => {
  try {
    const body = req.body;
    console.log({ body });
    const errors = validateSupportWorkerForm(body);
    if (
      errors.first_name ||
      errors.last_name ||
      errors.user ||
      errors.dob ||
      errors.city ||
      errors.street ||
      errors.state ||
      errors.zip
    ) {
      const supportworkers = await adminService.findSupportWorkerUsers();
      return res.render("supportworker/add-supportworker", {
        form: body,
        user: req.user,
        errors,
        supportworkers,
      });
    }
    const newsupportworker = {
      user_id: body.user,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: new Date(body.dob),
      address: {
        create: {
          street: body.street,
          city: body.city,
          state: body.state,
          zip: body.zip,
        },
      },
    };

    await supportworkerService.create(newsupportworker);
    res.redirect("/supportworkers");
  } catch (error) {
    console.log({ error });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const supportworkerId = req.params.id;
    const supportworker = await supportworkerService.findOne(supportworkerId);
    if (!supportworker) {
      return next(createHttpError(404, "Client Not Found"));
    }

    return res.render("supportworker/supportworker", {
      supportworker,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

function validateSupportWorkerForm(body) {
  const errors = {};
  if (body.first_name === "") {
    errors.first_name = "First Name is required";
  }
  if (body.last_name === "") {
    errors.last_name = "Last Name is required";
  }
  if (body.dob === "") {
    errors.dob = "Date of Birth is required";
  }
  if (body.user === "") {
    errors.user = "User is required";
  }
  if (body.street === "") {
    errors.street = "Street is required";
  }
  if (body.city === "") {
    errors.city = "City is required";
  }
  if (body.state === "") {
    errors.state = "State is required";
  }
  if (body.zip === "") {
    errors.zip = "Zip is required";
  }

  return errors;
}

module.exports = router;
