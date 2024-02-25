const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const bookingList = await Booking.find();
  if (!bookingList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(bookingList);
});

router.post(`/`, async (req, res) => {
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  if (!req.body.day) {
    return res.status(400).send("Please provide a valid booking day");
  }

  let existingBooking = await Booking.findOne({ roomId: req.body.roomId });

  if (existingBooking) {
    console.log(existingBooking)
    existingBooking.morningBooked = req.body.morningBooked;
    existingBooking.afternoonBooked = req.body.afternoonBooked;
    existingBooking.allDayBooked = req.body.morningBooked || req.body.afternoonBooked || req.body.allDayBooked;
    existingBooking = await existingBooking.save();
    return res.send(existingBooking);
  }

  let booking = new Booking({
    roomId: req.body.roomId,
    day: req.body.day,
    morningBooked: req.body.morningBooked,
    afternoonBooked: req.body.afternoonBooked,
    allDayBooked: !req.body.morningBooked || !req.body.morningBooked,
  });

  booking = await booking.save();
  if (!booking) return res.status(500).send("The booking cannot be created!");

  return res.send(booking);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Booking Id");
  }
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  let booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      roomId: req.body.roomId,
      day: req.body.day,
      morningBooked: req.body.morningBooked,
      afternoonBooked: req.body.afternoonBooked,
      allDayBooked: req.body.allDayBooked,
    },
    {
      new: true,
    }
  );

  if (!booking) return res.status(500).send("The booking cannot be updated");
  return res.send(booking);
});

router.get("/:roomId/:day", async (req, res) => {
    try {
      const day = new Date(req.params.day);
      const roomId = req.params.roomId;
      const booking = await Booking.findOne({ roomId, day });
  
      let availability = [];
      if (!booking) {
        availability = [
          { slot: "Morning", booked: true },
          { slot: "Afternoon", booked: true },
          { slot: "All Day", booked: true },
        ];
      } else {
        availability = [
          { slot: "Morning", booked: booking.morningBooked },
          { slot: "Afternoon", booked: booking.afternoonBooked },
          { slot: "All Day", booked: booking.allDayBooked },
        ];
      }
  
      return res.send(availability);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
