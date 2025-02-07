const { PrismaClient, TaskStatus } = require("@prisma/client");
const { supportWorker } = require("../db");

const prisma = new PrismaClient();

const find = async (userId) => {
  if (userId) {
    return prisma.task.findMany({
      where: {
        SupportWorker: {
          userId,
        },
      },
    });
  }
  return prisma.task.findMany({
    include: {
      SupportWorker: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });
};

const findOne = async (id) => {
  return prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      SupportWorker: {
        select: {
          userId: true,
        },
      },
    },
  });
};
const create = async (body) => {
  console.log({ details, supportWorkerId });

  return prisma.task.create({
    data: {
      ...details,
      SupportWorker: {
        connect: {
          id: supportWorkerId,
        },
      },
    },
  });
};
const update = async (id, body) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: body,
  });
};
const completeTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    include: {
      SupportWorker: {
        select: {
          userId: true,
        },
      },
    },
  });
  // update if the currently loggedin user is the task support worker
  if (task.SupportWorker.userId === userId) {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: TaskStatus.COMPLETED,
      },
    });
    return true;
  }
  return false;
};

const cancelTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    include: {
      SupportWorker: {
        select: {
          userId: true,
        },
      },
    },
  });
  // update if the currently loggedin user is the task support worker
  if (task.SupportWorker.userId === userId) {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: TaskStatus.CANCELLED,
      },
    });
    return true;
  }
  return false;
};

module.exports = {
  find,
  findOne,
  create,
  update,
  completeTask,
  cancelTask,
};
