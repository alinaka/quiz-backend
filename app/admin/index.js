const passport = require('passport');
const path = require('path');
const models = require('../../models');

function initUser(app) {
    app.get('/admin', renderLoginPage);
    app.get('/admin/dashboard', passport.authenticationMiddleware(), renderDashboard);
    app.post('/admin/login', passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin'
    }));
    app.get('/admin/logout', logout);
    app.get('/admin/frame', renderForm);
    app.post('/admin/upload', uploadFile)
}

function renderLoginPage(req, res) {
    res.render('admin/login')
}

function renderDashboard(req, res) {
    res.render('admin/dashboard', {
        username: req.user.username
    });
}

function renderForm(req, res) {
    models.Movie.findAll({
        attributes: ['id', 'title'],
    }).then((movies) => {
        res.render('admin/frame', {
            movies: movies
        })
    });
}

function logout(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/admin');
    })
}

function uploadFile(req, res, next) {
    if (Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    if (req.body.movie) {
        models.Movie.findByPk(req.body.movie).then((movie) => {
            if (movie) {
                createFrame(movie, req.files.frame).then(
                    result=>res.send(result),
                    error=>res.status(500).send(error)
                );
            } else {
                res.status(404).send('Not found')
            }
        });
    } else {
        models.Movie.create({
            title: req.body.title,
            internationalTitle: req.body.internationalTitle,
            year: req.body.year
        }).then((movie) => {
                createFrame(movie, req.files.frame).then(
                    result=>res.send(result),
                    error=>res.status(500).send(error)
                );
            })
    }
}

function createFrame(movie, sampleFile) {
    let uploadPath = path.join(__dirname, '../../frames/' + sampleFile.name);
    return new Promise((resolve, reject)=>{
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                reject(err);
            models.Frame.create({name: sampleFile.name, MovieId: movie.id}).then((frame) => {
                resolve('Frame is successfully uploaded! FrameId ' + frame.id);
            });
        })
    });
}

module.exports = initUser;
