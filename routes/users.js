const express = require('express');
const models = require('../models');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/score', auth, saveScore);

function saveScore(req, res) {
	let result = req.body;
	if (result) {
    models.Score.create({
      UserId: req.user.subject,
      count: +req.body.score,
      time: '00:00:' + req.body.time
    }).then((score) => {
      if (!score) {
          res.status(500).send('An error occurred while saving score.')
      }
      res.status(201).send({score, 'message': 'Successfully saved score.'});
    }).catch((err)=>{
      res.status(400).send({'error': err})
    })
  }
}

module.exports = router;
