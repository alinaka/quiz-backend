const express = require('express');
const models = require('../models');
const router = express.Router();

router.get('/movies', (req, res) => {
    models.Frame.findAll({
        attributes: ['id', 'name', 'MovieId'],
        include: [{
            model: models.Movie,
            attributes: ['title']
        }]
    }).then(function (users) {
        let frames = mapFrames(users);
        getOptions(frames).then(result => res.send(result));
    });
});


function getOptions(frames) {
    let promises = [];
    for (let i = 0; i < frames.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            models.Movie.findAll({
                attributes: ['id', 'title'],
                where: {
                    id: {
                        [models.Sequelize.Op.ne]: frames[i].answer_id
                    }
                },
                limit: 3,
                order: models.sequelize.random(),
            }).then(function (movies) {
                let options = [];
                for (let i = 0; i < movies.length; i++) {
                    options.push(movies[i].title);
                }
                options.push(frames[i].answer);
                options.sort(() => Math.random() - 0.5);
                delete frames[i].answer_id;
                frames[i].options = options;
                resolve();
            });
        }));
    }
    return Promise.all(promises).then(() => frames)
}

function mapFrames(frames) {
    let staticPath = 'http://localhost:3000/frames/';
    let mappedFrames = [];
    for (let i = 0; i < frames.length; i++) {
        mappedFrames.push({
            id: frames[i].id,
            answer: frames[i].Movie.title,
            answer_id: frames[i].MovieId,
            image: staticPath + frames[i].name
        })
    }
    return mappedFrames;
}

module.exports = router;
