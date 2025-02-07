const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function find() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  return users;
}

async function findOne(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

findByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const count = async () => {
  const count = await prisma.user.count();
  return count;
};

const recent = (number = 10) => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: number,
    select: {
      id: true,
      email: true,
      role: true,
      updatedAt: true,
      createdAt: true,
    },
  });
};

module.exports = { find, count, findOne, findByEmail, recent };
