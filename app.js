var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var app = express();


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
app.use(cors());

app.use('/user', require('./api/user/user.controller'));
app.use('/food', require('./api/food/food.controller'));
app.use('/order', require('./api/order/order.controller'));

module.exports = app;