const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    roomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    startTime: 
    { 
        type: Date, 
        required: true 
    },
    endTime: 
    { 
        type: Date, 
        required: true 
    },
});

exports.Booking = mongoose.model('Booking', bookingSchema);