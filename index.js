const port = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
//Initializing authentication
require('./passport')(app);

//routes require auth initialized
const auth = require('./routes/auth');
const api = require('./routes/api');
const admin = require('./routes/admin');
const users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(fileUpload());

// app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());

app.use('/api', api);
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/users', users);

// app.get('/', function (req, res, next) {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });
app.use('/frames', express.static('frames'));

app.listen(port, function (err) {
    if (err) {
        throw err
    }

    console.log(`Example app listening on port ${port}...`)
});