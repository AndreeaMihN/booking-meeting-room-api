const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 500,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Office",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  floor: Number,
});

exports.Room = mongoose.model("Room", roomSchema);
