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

router.post(`/morning`, async (req, res) => {
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  if (!req.body.day) {
    return res.status(400).send("Please provide a valid booking day");
  }

  if (req.body.morningBooked === undefined) {
    return res.status(400).send("Please provide a valid booking morningBooked");
  }

  let existingBooking = await Booking.findOne({ roomId: req.body.roomId });

  if (existingBooking) {
    existingBooking.morningBooked = req.body.morningBooked;
    existingBooking.allDayBooked =
      existingBooking.morningBooked && existingBooking.afternoonBooked;
    existingBooking = await existingBooking.save();
    return res.send(existingBooking);
  }

  let booking = new Booking({
    roomId: req.body.roomId,
    day: req.body.day,
    morningBooked: req.body.morningBooked,
  });

  booking = await booking.save();
  if (!booking) return res.status(500).send("The booking cannot be created!");

  return res.send(booking);
});

router.post(`/afternoon`, async (req, res) => {
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  if (!req.body.day) {
    return res.status(400).send("Please provide a valid booking day");
  }

  if (req.body.afternoonBooked === undefined) {
    return res
      .status(400)
      .send("Please provide a valid booking afternoonBooked");
  }

  let existingBooking = await Booking.findOne({ roomId: req.body.roomId });

  if (existingBooking) {
    existingBooking.afternoonBooked = req.body.afternoonBooked;
    existingBooking.allDayBooked =
      existingBooking.morningBooked && existingBooking.afternoonBooked;
    existingBooking = await existingBooking.save();
    return res.send(existingBooking);
  }

  let booking = new Booking({
    roomId: req.body.roomId,
    day: req.body.day,
    morningBooked: req.body.morningBooked,
  });

  booking = await booking.save();
  if (!booking) return res.status(500).send("The booking cannot be created!");

  return res.send(booking);
});

router.post(`/allday`, async (req, res) => {
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  if (!req.body.day) {
    return res.status(400).send("Please provide a valid booking day");
  }

  if (req.body.allDayBooked === undefined) {
    return res.status(400).send("Please provide a valid booking allDayBooked");
  }

  let existingBooking = await Booking.findOne({ roomId: req.body.roomId });

  if (existingBooking) {
    existingBooking.allDayBooked = req.body.allDayBooked;
    if (req.body.allDayBooked) {
      existingBooking.morningBooked = true;
      existingBooking.afternoonBooked = true;
    }
    existingBooking = await existingBooking.save();
    return res.send(existingBooking);
  }

  let booking = new Booking({
    roomId: req.body.roomId,
    day: req.body.day,
    morningBooked: req.body.morningBooked,
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
    if (!booking) {
      console.log("here");
      console.log("booking", booking);
      return res.send(["Morning", "Afternoon", "All-day"]);
    }

    const falseSlots = [];
    if (!booking.morningBooked) {
      falseSlots.push("Morning");
    }
    if (!booking.afternoonBooked) {
      falseSlots.push("Afternoon");
    }
    if (!booking.allDayBooked) {
      falseSlots.push("All-day");
    }

    return res.send(falseSlots);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
