const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticationMiddleware = require('../middleware/auth');
const models = require('../models');
const bcrypt = require('bcrypt');

function findUser(username, callback) {
  models.User.findOne({
    where: {username: username}
  }).then((user) => {
    if (user) {
      return callback(null, user)
    }
    return callback(null)
  });
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
});

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
});

function initPassport() {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }
        // User not found
        if (!user) {
          return done(null, false, {'message': 'Incorrect username.'});
        }

        bcrypt.compare(password, user.hash, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false, {'message': 'Incorrect password.'});
          }
          return done(null, user)
        })
      })
    }
  ));

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport;