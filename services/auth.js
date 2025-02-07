const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

const register = async (email, password, role = Role.SUPPORTWORKER) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new Error("An account with this email already exists.");
  }

  const hash = bcrypt.hashSync(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      role,
      password: hash,
    },
  });

  return newUser;
};

module.exports = { login, register };
