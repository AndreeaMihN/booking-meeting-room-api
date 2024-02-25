const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    roomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    day: {
        type: Date,
        required: true 
    },
    morningBooked: {
        type: Boolean,
        required: true 
      },
    afternoonBooked: {
        type: Boolean,
        required: true 
      },
    allDayBooked: {
        type: Boolean,
        required: true 
      },
});

exports.Booking = mongoose.model('Booking', bookingSchema);