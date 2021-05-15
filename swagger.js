const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, {
    info: {
        title: 'Food Court REST API',
        description: 'This is the auto generated API documentation for Food Court REST API.',
      },
    host: 'localhost:4001',
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter your bearer token in the format **Bearer &lt;token>**"
        }
    }
}).then(() => {
    require('./server.js')
})