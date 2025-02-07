// Admin Routes
const router = require("express").Router();
const { Role, PrismaClient } = require("@prisma/client");
const { RoleMiddleware } = require("../middleware/role.middleware");
const clientsService = require("../services/clients");
const adminService = require("../services/admin");
const supportworkerService = require("../services/supportworker");
const prisma = new PrismaClient();
const createHttpError = require("http-errors");

// Assign Client to supportworker
router.use(RoleMiddleware([Role.ADMIN]));

router.get("/assign-client/:id", async (req, res) => {
  try {
    const clients = await adminService.findUnAssignedClients();

    return res.render("supportworker/assign-client", {
      clients,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/assign-client/:id", async (req, res) => {
  try {
    const body = req.body;

    const supportworkerId = req.params.id;
    const clientId = body.client;
    await adminService.assignClientToSupportWorker(clientId, supportworkerId);
    res.redirect(`/supportworkers/${supportworkerId}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/unassign-client/:id", async (req, res, next) => {
  try {
    const clientId = req.query.clientId;
    const supportworkerId = req.params.id;
    if (!clientId) {
      console.log({ clientId });
      return next(createHttpError(404, "Client Id must be provided"));
    }
    await adminService.deAssignClientToSupportWorker(clientId, supportworkerId);

    console.log({ supportworkerId });

    res.redirect(`/supportworkers/${supportworkerId}`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
