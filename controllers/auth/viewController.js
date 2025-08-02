const viewController = {
  signUp(req, res, next) {
    res.render('auth/SignUp');
  },

  signIn(req, res, next) {
    res.render('auth/SignIn');
  },

  apiAuth(req, res, next) {
    res.json({ user: req.user, token: res.locals.data.token });
  },

  redirectToLogin(req, res, next) {
    res.redirect('/users/login');
  },

  redirectToPlants(req, res, next) {
    const token = req.query.token || res.locals.data.token || '';
    if (token) {
      res.redirect(`/plants?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect('/plants');
    }
  }
};

module.exports = viewController;
