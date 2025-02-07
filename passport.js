const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: email,
            },
          });
          if (!user)
            return done(null, false, { message: "Invalid Credentials" });

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid Credentials" });
            }
          });
        } catch (error) {
          return done(null, false, { message: "Invalid Credentials" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    prisma.user
      .findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });
};
