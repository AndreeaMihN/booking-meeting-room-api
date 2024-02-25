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
        default: false
      },
    afternoonBooked: {
        type: Boolean,
        default: false
      },
    allDayBooked: {
        type: Boolean,
        default: false
      },
});

exports.Booking = mongoose.model('Booking', bookingSchema);