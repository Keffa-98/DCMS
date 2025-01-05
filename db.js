// Description: This file is used to connect to the database.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    console.log("Prisma Connected");
  })
  .catch((err) => {
    throw err;
  });

module.exports = prisma;
