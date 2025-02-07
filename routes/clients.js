const express = require("express");
const router = express.Router();
const clientsService = require("../services/clients");
const createHttpError = require("http-errors");
const { RoleMiddleware } = require("../middleware/role.middleware");
const { Role } = require("@prisma/client");
const AuthMiddleware = require("../middleware/auth.middleware");

router.use(AuthMiddleware);

router.get("", async (req, res) => {
  try {
    let clients;
    if (req.user.role === Role.ADMIN) {
      clients = await clientsService.find();
    } else {
      clients = await clientsService.supportWorkerClients(req.user.id);
    }
    res.render("clients/client-list", {
      clients,
      title: "Client List",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/new", RoleMiddleware([Role.ADMIN]), async (req, res) => {
  res.render("clients/add-client", { title: "New Client", user: req.user });
});

router.post("/new", RoleMiddleware([Role.ADMIN]), async (req, res) => {
  const body = req.body;
  const errors = validateForm(body);

  if (
    errors.client_fname ||
    errors.client_lname ||
    errors.client_dob ||
    errors.client_gender ||
    errors.client_city ||
    errors.client_street ||
    errors.client_state ||
    errors.client_zip ||
    errors.emergency_fname ||
    errors.emergency_lname ||
    errors.emergency_phone ||
    errors.emergency_email
  ) {
    return res.render("clients/add-client", {
      errors,
      title: "Create Client",
      form: body,
    });
  }
  try {
    console.log("Creating client");

    await clientsService.create(body);
    res.redirect("/clients");
  } catch (error) {
    res.render("clients/add-client", {
      title: "Create Client",
      error,
      form: body,
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const client = await clientsService.findOne(req.params.id);
    if (!client) {
      return next(createHttpError(404, "Client Not Found"));
    }
    return res.render("clients/client", {
      title: "Client Detail",
      client,
      user: req.user,
    });
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/:id/medical-record",
  RoleMiddleware([Role.ADMIN, Role.SUPPORTWORKER]),
  (req, res) => {
    return res.render("clients/add-medical-record", {
      title: "Add Medical Record",
      user: req.user,
    });
  }
);
router.post("/:id/medical-record", async (req, res, next) => {
  try {
    body = req.body;
    const errors = validateMedicalRecordForm(body);
    if (
      errors.allergies ||
      errors.chronicDiseases ||
      errors.notes ||
      errors.disabilityType ||
      errors.medication_name ||
      errors.medication_dosage ||
      errors.medication_frequency
    ) {
      return res.render("clients/add-medical-record", {
        title: "Add Medical Record",
        user: req.user,
        errors,
      });
    }
    const medicalRecord = {
      clientId: req.params.id,
      allergies: body.allergies,
      chronicDiseases: body.chronicDiseases,
      disabilityType: body.disabilityType,
      notes: body.notes,
      medication: {
        name: body.medication_name,
        dosage: body.medication_dosage,
        frequency: body.medication_frequency,
      },
    };
    console.log({ medicalRecord });
    const record = await clientsService.addMedicalRecord(medicalRecord);

    return res.redirect(`/clients/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/care-plan", (req, res) => {
  return res.render("clients/add-care-plan", {
    title: "Add Care Plan",
    user: req.user,
  });
});

router.post("/:id/care-plan", async (req, res, next) => {
  try {
    body = req.body;
    const errors = validateCarePlanForm(body);

    if (
      errors.title ||
      errors.description ||
      errors.startDate ||
      errors.endDate
    ) {
      return res.render("clients/add-care-plan", {
        title: "Add Care Plan",
        user: req.user,
        errors,
      });
    }
    const carePlan = {
      title: body.title,
      description: body.description,
      clientId: req.params.id,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    };
    console.log({ carePlan });
    await clientsService.addCarePlan(carePlan);
    return res.redirect(`/clients/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

// Helpers
function validateCarePlanForm(body) {
  console.log({ body });
  const errors = {};
  if (body.title === "") {
    errors.title = "Title is Required";
  }
  if (body.description === "") {
    errors.description = "Description is Required";
  }

  if (body.startDate === "") {
    errors.startDate = "Start Date is Required";
  }
  if (body.endDate === "") {
    errors.endDate = "End Date is Required";
  }
  return errors;
}

function validateMedicalRecordForm(body) {
  console.log({ body });

  const errors = {};
  if (body.allergies === "") {
    errors.allergies = "Allergies is Required";
  }
  if (body.chronicDiseases === "") {
    errors.chronicDiseases = "Chronic Diseases is Required";
  }
  if (body.notes === "") {
    errors.notes = "Notes is Required";
  }
  if (body.disabilityType === "") {
    errors.disabilityType = "Disability Type is Required";
  }
  if (body.medication_name === "") {
    errors.medication_name = "Medication Name is Required";
  }
  if (body.medication_dosage === "") {
    errors.medication_dosage = "Medication Dosage is Required";
  }
  if (body.medication_frequency === "") {
    errors.medication_frequency = "Medication Frequency is Required";
  }
  return errors;
}
function validateForm(body) {
  const errors = {};
  if (body.client_fname === "") {
    errors.client_fname = "Last Name is required";
  }
  if (body.client_lname === "") {
    errors.client_lname = "First Name is required";
  }
  if (body.client_dob === "") {
    errors.client_dob = "Date of Birth is required";
  }
  if (body.client_gender === "") {
    errors.client_gender = "Gender is required";
  }
  if (body.client_street === "") {
    errors.client_street = "Street is required";
  }
  if (body.client_city === "") {
    errors.client_city = "City is required";
  }
  if (body.client_state === "") {
    errors.client_state = "State is required";
  }
  if (body.client_zip === "") {
    errors.client_zip = "Zip is required";
  }
  if (body.emergency_fname === "") {
    errors.emergency_fname = "First Name is required";
  }
  if (body.emergency_lname === "") {
    errors.emergency_lname = "Last Name is required";
  }
  if (body.emergency_phone === "") {
    errors.emergency_phone = "Phone is required";
  }
  if (body.emergency_email === "") {
    errors.emergency_email = "Email is required";
  }
  return errors;
}

module.exports = router;
