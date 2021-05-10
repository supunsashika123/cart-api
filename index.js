var express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.method + ' ' + req.originalUrl}`);
  next()
});

app.get('/', async (req, res) => {
  res.send({
    'message': "Welcome to the Food Court api."
  });
})

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.use('/user', require('./api/user/user.controller'));

app.listen(port);
console.log('Food Court RESTful API server started on: ' + port);