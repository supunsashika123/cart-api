require('dotenv').config();

const app = require('./app')

var port = process.env.PORT || 3001;

app.listen(port);
console.log('Food Court RESTful API server started on: ' + port);