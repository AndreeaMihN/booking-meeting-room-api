const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: String,
});

exports.Room = mongoose.model('User', roomSchema);