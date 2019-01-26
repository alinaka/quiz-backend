const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
      if(!req.headers.authorization) {
        return res.status(401).send({'error': 'Unauthorized request'})
      }
      let token = req.headers.authorization.split(' ')[1];
      if(token === 'null') {
        return res.status(401).send({'error': 'Token not provided.'})
      }
      try {
        req.user = jwt.verify(token, config.get('SECRET_KEY'));
        next()
      }
      catch(ex){
        res.status(401).send({'error': 'Invalid token.'})
      }
};