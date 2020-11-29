const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/guessit', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

module.exports = db