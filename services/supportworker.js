const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const find = () => {
  return prisma.supportWorker.findMany({});
};

const findOne = (id) => {
  return prisma.supportWorker.findUnique({
    where: {
      id,
    },
    include: {
      address: true,
      clients: true,
    },
  });
};
const count = async () => {
  return prisma.supportWorker.count();
};

const create = (body) => {
  const { user_id, ...details } = body;
  return prisma.supportWorker.create({
    data: {
      ...details,
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });
};

const recent = (number = 10) => {
  return prisma.supportWorker.findMany({
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
  find,
  findOne,
  create,
  count,
  recent,
};
