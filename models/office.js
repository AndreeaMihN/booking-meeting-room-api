const mongoose = require('mongoose');

const officeSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  }
});

exports.Office = mongoose.model('Office', officeSchema);
