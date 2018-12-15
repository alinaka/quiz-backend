const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const models = require('./models');

const routes = require('./routes/routes');

app.use(cors());
// app.use(express.static(path.join(__dirname, 'dist')));
app.use('/quiz', routes);


// app.get('/', function (req, res, next) {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

