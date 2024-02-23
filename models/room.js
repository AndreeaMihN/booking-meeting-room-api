const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
//   bookedSlots: [{
//     start: {
//         type: Date,
//         required: true,
//     },
//     end: {
//         type: Date,
//         required: true,
//     }
// }],
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 90,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    required: true,
  },
  floor: Number,
});

exports.Room = mongoose.model('Room', roomSchema);
