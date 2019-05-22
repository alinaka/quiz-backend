const express = require('express');
const models = require('../models');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const path = require('path');
const uuidv4 = require('uuid/v4');

router.get('/', [auth, admin], renderDashboard);
router.get('/frame', [auth, admin], renderForm);
router.delete('/frame/:frameId', [auth, admin], deleteFrame);
router.get('/frame/:frameId', [auth, admin], getFrame);
router.post('/upload', [auth, admin], uploadFile);
router.get('/movies', [auth, admin], getAllMovies);
router.get('/frames', [auth, admin], getAllFrames);
router.delete('/movie/:movieId', [auth, admin], deleteMovie);
router.post('/movie', [auth, admin], createMovie);
router.get('/movie/:movieId', [auth, admin], getMovie);
router.put('/movie/:movieId', [auth, admin], editMovie);


function renderDashboard(req, res) {
  res.send({
    username: req.user.username
  });
}

function renderForm(req, res) {
  models.Movie.findAll({
    attributes: ['id', 'title'],
  }).then((movies) => {
    res.send({
      movies: movies
    })
  });
}

function uploadFile(req, res, next) {
  console.log(req.files);
  console.log(req.files.frame);
  console.log(req.body);
  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  if (req.body.movieId) {
    models.Movie.findByPk(req.body.movieId).then((movie) => {
      if (movie) {
        createFrame(movie, req.files.frame).then(
          result => res.send(result),
          error => res.status(500).send(error)
        );
      } else {
        res.status(404).send({message: 'Not found.'})
      }
    });
  } else {
    models.Movie.create({
      title: req.body.title,
      internationalTitle: req.body.internationalTitle,
      year: req.body.year
    }).then((movie) => {
      createFrame(movie, req.files.frame).then(
        result => res.send(result),
        error => res.status(500).send(error)
      );
    })
  }
}

function createFrame(movie, sampleFile) {
  let filename = uuidv4() + '.jpg';
  let uploadPath = path.join(__dirname, '../frames/' + filename);
  return new Promise((resolve, reject) => {
    sampleFile.mv(uploadPath, function (err) {
      if (err)
        reject(err);
      models.Frame.create({name: filename, MovieId: movie.id}).then((frame) => {
        resolve({frame, message: 'Frame is successfully uploaded! FrameId ' + frame.id});
      });
    })
  });
}

function getAllMovies(req, res) {
  models.Movie.findAll().then((movies) => {
    res.send({
      movies: movies
    })
  });
}

function getAllFrames(req, res) {
  let staticPath = 'http://localhost:3000/frames/';
  models.Frame.findAll().then((frames) => {
    for (let i = 0; i < frames.length; i++) {
      frames[i].url = staticPath + frames[i].name
    }
    res.send({
      frames: frames
    })
  });
}

function deleteMovie(req, res) {
  models.Movie.destroy({
      where: {
          id: req.params.movieId
      }
  }).then((movie)=>{
    if (!movie) {
      return res.status(404).send({message: "Not found."});
    }
    res.send({message: `Movie is deleted from database`})
  });
}

function deleteFrame(req, res) {
  models.Frame.destroy({
    where: {
      id: req.params.frameId
    }
  }).then((count) => {
    if (!count) {
      res.status(404).send({message: "Not found"});
    } else {
      res.send({message: `Frame is deleted from database.`});
    }
  });
}

function getMovie(req, res) {
  models.Movie.findByPk(req.params.movieId, {
    attributes: ['id', 'title', 'internationalTitle', 'year'],
    include: [{
      model: models.Frame,
      attributes: ['name', 'id']
    }]
  }).then((movie) => {
    let staticPath = 'http://localhost:3000/frames/';
    if (!movie) {
      res.status(404).send("Not found");
      return
    }
    for (let i = 0; i < movie.Frames.length; i++) {
      movie.Frames[i].url = staticPath + movie.Frames[i].name
    }
    res.send({movie});
  });
}

function getFrame(req, res) {
  models.Frame.findByPk(req.params.frameId, {
    include: [{
      model: models.Movie,
      attributes: ['title', 'internationalTitle', 'year'],
    }]
  }).then((frame) => {
    res.send({
      frame: frame,
      movies: []
    });
  });
}

function editMovie(req, res) {
  models.Movie.update({
    'title': req.body.title,
    'internationalTitle': req.body.internationalTitle,
    'year': req.body.year
  },{
    where: {
      id: req.params.movieId
    }
  }).then((movie) => {
    if (movie) {
      res.send({message: 'Successfully updated the movie.'});
    }
    else {
      res.send({message: 'Failed to update movie.'});
    }
  });
}

function createMovie(req, res){
  models.Movie.create({
    'title': req.body.title,
    'internationalTitle': req.body.internationalTitle,
    'year': req.body.year
  }).then((movie)=>{
      if (movie) {
        res.send({movie, message: 'Successfully added movie.'});
      }
      else {
        res.send({message: 'Failed to update movie.'});
      }
  })
}

module.exports = router;