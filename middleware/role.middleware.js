function RoleMiddleware(allowedRoles) {
  return (req, res, next) => {
    let url = req._parsedOriginalUrl.pathname;
    if (!req.user) {
      return res.redirect(`/auth/signin?next=${url}`);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).render("errors/403", {
        message: "Forbidden: You don't have permission to access this page.",
      });
    }
    next();
  };
}

module.exports = {
  RoleMiddleware,
};
