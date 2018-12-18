const port = process.env.PORT || 3000;
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const quiz = require('./app/quiz');
const config = require('./config');
const fileUpload = require('express-fileupload');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(fileUpload());

require('./app/authentication').init(app);

app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({
    defaultLayout: 'views/main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname),
    partialsDir: path.join(__dirname)
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'app'));

require('./app/admin')(app);

app.use(cors());
// app.use(express.static(path.join(__dirname, 'dist')));

app.use('/quiz', quiz);

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