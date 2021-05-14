require('dotenv').config();

const app = require('./app')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

var port = process.env.PORT || 3001;

app.listen(port);
console.log('Food Court RESTful API server started on: ' + port);