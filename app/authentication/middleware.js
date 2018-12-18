function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/admin')
    }
}

module.exports = authenticationMiddleware;