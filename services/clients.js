const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function supportWorkerClients(userId) {
  console.log({ USERID: userId });
  const supportWorker = await prisma.supportWorker.findUnique({
    where: {
      userId,
    },
  });
  if (!supportWorker) {
    throw new Error("support worker not found");
  }

  return prisma.client.findMany({
    where: {
      supportWorkerId: supportWorker.id,
    },
  });
}
async function find() {
  return prisma.client.findMany({});
}
async function findOne(id) {
  return await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      address: {
        select: {
          city: true,
          state: true,
          street: true,
          zip: true,
        },
      },
      emergencyContact: true,
      medical_record: true,
      care_plans: true,
      supportWorker: true,
    },
  });
}

async function create(data) {
  return await prisma.client.create({
    data: {
      first_name: data.client_fname,
      last_name: data.client_lname,
      date_of_birth: new Date(data.client_dob),
      gender: data.client_gender,
      emergencyContact: {
        create: {
          first_name: data.emergency_fname,
          last_name: data.emergency_lname,
          phone: data.emergency_phone,
          email: data.emergency_email,
        },
      },
      address: {
        create: {
          street: data.client_street,
          city: data.client_city,
          state: data.client_state,
          zip: data.client_zip,
        },
      },
    },
  });
}

async function addMedicalRecord(data) {
  const { medication, clientId, ...medicalRecord } = data;
  return await prisma.medicalRecord.create({
    data: {
      ...medicalRecord,
      Client: {
        connect: {
          id: clientId,
        },
      },
      medications: { create: [{ ...medication }] },
    },
  });
}

function addCarePlan(data) {
  const { clientId, ...carePlan } = data;
  return prisma.carePlan.create({
    data: {
      ...carePlan,
      client: {
        connect: {
          id: clientId,
        },
      },
    },
  });
}

const count = async (userId) => {
  if (userId) {
    return prisma.client.count({
      where: {
        supportWorker: {
          userId,
        },
      },
    });
  }
  return prisma.client.count();
};

async function supportWorkerClients(userId) {
  return prisma.client.findMany({
    where: {
      supportWorker: {
        userId,
      },
    },
  });
}
const recent = (number = 10) => {
  return prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: number,
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });
};

module.exports = {
  count,
  find,
  create,
  findOne,
  addMedicalRecord,
  addCarePlan,
  supportWorkerClients,
  recent,
};
