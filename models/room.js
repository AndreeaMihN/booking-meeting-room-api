const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: String,
    description: String,
    booked: {
        type: Boolean,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
});

exports.Room = mongoose.model('Room', roomSchema);