const express = require('express');
const router = express.Router();
const models = require('../models');
const auth = require('../middleware/auth');
const passport = require('passport');

router.post('/login', userLogin);
router.post('/register', userSignUp);
router.post('/refresh', auth, refreshToken);
router.get('/token', auth, validateToken);

function userLogin(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      let token = user.generateAuthToken();
      return res.status(200).send({token, user, isAdmin: user.isAdmin});
    });
  })(req, res, next);
}

function userSignUp(req, res){
    user = req.body;
  if (user) {
    const hash = models.User.generateHash(req.body.password);
    models.User.create({
      username: req.body.username,
      hash: hash
    }).then((user) => {
      if (!user) {
          res.status(500).send('An error occurred while signing up.')
      }
      let token = user.generateAuthToken();
      res.status(201).send({token, user, 'message': 'Successfully signed up.'});
    }).catch((err)=>{
      res.status(400).send({'error': `User with username ${err.errors[0].value} already exists.`})
    })
  }
}

function refreshToken(req, res){
  let timeLeft = new Date(req.user.exp * 1000) - Date.now();
  let day = 24 * 60 * 60 * 1000;
  if (timeLeft < day) {
      models.User.findOne({
      where: {username: req.user.username}
    }).then((user) => {
      let token = user.generateAuthToken();
      res.send({token});
    });
  } else {
    res.status(200).send()
  }
}

function validateToken(req, res){
  res.send({'message': true})
}

module.exports = router;
