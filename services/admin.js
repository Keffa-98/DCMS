const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const assignClientToSupportWorker = (client_id, supportworker_id) => {
  return prisma.client.update({
    where: {
      id: client_id,
    },
    data: {
      supportWorkerId: supportworker_id,
    },
  });
};

const deAssignClientToSupportWorker = (client_id, supportworker_id) => {
  return prisma.client.update({
    where: {
      id: client_id,
    },
    data: {
      supportWorker: {
        disconnect: {
          id: supportworker_id,
        },
      },
    },
  });
};

const findSupportWorkerUsers = () => {
  return prisma.user.findMany({
    where: {
      role: {
        equals: Role.SUPPORTWORKER,
      },
      supportWorker: null,
    },
    select: {
      id: true,
      email: true,
    },
  });
};

const findUnAssignedClients = () => {
  return prisma.client.findMany({
    where: {
      supportWorker: null,
    },
  });
};

module.exports = {
  assignClientToSupportWorker,
  findSupportWorkerUsers,
  deAssignClientToSupportWorker,
  findUnAssignedClients,
};
