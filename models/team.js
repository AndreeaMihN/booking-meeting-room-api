const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  numberOfMembers: {
    type: Number,
    require: true,
  }
});

exports.Team = mongoose.model('Team', teamSchema);
