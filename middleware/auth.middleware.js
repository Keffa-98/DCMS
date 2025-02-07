async function AuthMiddleware(req, res, next) {
  let url = req._parsedOriginalUrl.pathname;

  if (!req.user) {
    return res.redirect(`/auth/signin?next=${url}`);
  }
  next();
}

module.exports = AuthMiddleware;
