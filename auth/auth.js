const User = require('../models/User');

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

const isLoggedOut = (req, res, next) => {
  if (!req.session || !req.session.loggedIn) {
    next();
  } else {
    res.redirect('/home');
  }
};

const loadUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (user) {
        req.user = user;
        res.locals.user = user;
        res.locals.isLoggedIn = true;
      } else {
        res.locals.isLoggedIn = false;
      }
    } catch (err) {
      console.error('Error loading user:', err);
      res.locals.isLoggedIn = false;
    }
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
};

module.exports = { isLoggedIn, isLoggedOut, loadUser };