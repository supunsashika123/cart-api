const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Guser: require('../models/Guser.model'),
    Token: require('../models/token.model')
};
