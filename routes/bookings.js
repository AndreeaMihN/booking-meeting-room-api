const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const { Team } = require("../models/team");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Slot } = require("../utils/slot.const");

router.post(`/`, async (req, res) => {
  const roomId = req.body.roomId;
  const teamId = req.body.teamId;

  const existingBooking = await Booking.findOne({
    roomId,
    $and: [
      { teamId: { $ne: teamId } },
      {
        $or: [
          { morningBooked: true },
          { afternoonBooked: true },
          { allDayBooked: true },
        ],
      },
    ],
  });

  if (existingBooking) {
    return res.status(400).send("Slot already booked for another team");
  }

  const room = await Room.findById(roomId);
  if (!room) return res.status(400).send("Invalid Room");

  const team = await Team.findById(teamId);
  if (!team) return res.status(400).send("Invalid Team");

  if (!req.body.day) {
    return res.status(400).send("Please provide a valid booking day");
  }

  let booking = await Booking.findOne({ roomId, teamId, day: req.body.day });

  if (booking) {
    booking.morningBooked = req.body.morningBooked;
    booking.afternoonBooked = req.body.afternoonBooked;
    booking.allDayBooked =
      req.body.morningBooked ||
      req.body.afternoonBooked ||
      req.body.allDayBooked;
    booking = await booking.save();
    return res.send(booking);
  } else {
    booking = new Booking({
      roomId,
      teamId,
      day: req.body.day,
      morningBooked: req.body.morningBooked,
      afternoonBooked: req.body.afternoonBooked,
      allDayBooked: !req.body.morningBooked || !req.body.morningBooked,
    });

    booking = await booking.save();
    if (!booking) return res.status(500).send("The booking cannot be created!");

    return res.send(booking);
  }
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Booking Id");
  }
  const room = await Room.findById(req.body.roomId);
  if (!room) return res.status(400).send("Invalid Room");

  const team = await Team.findById(req.body.teamId);
  if (!team) return res.status(400).send("Invalid Team");

  let booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      roomId: req.body.roomId,
      teamId: req.body.teamId,
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

router.get("/:roomId/:day/:teamId", async (req, res) => {
  try {
    const day = new Date(req.params.day);
    const roomId = req.params.roomId;
    const teamId = req.params.teamId;
    const booking = await Booking.findOne({ roomId, day, teamId });

    let availability = [];
    if (!booking) {
      availability = [
        { slot: Slot.Morning, booked: true },
        { slot: Slot.Afternoon, booked: true },
        { slot: Slot.AllDay, booked: true },
      ];
    } else {
      availability = [
        { slot: Slot.Morning, booked: booking.morningBooked },
        { slot: Slot.Afternoon, booked: booking.afternoonBooked },
        { slot: Slot.AllDay, booked: booking.allDayBooked },
      ];
    }

    return res.send(availability);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/teams/:roomId/:day", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const day = new Date(req.params.day);

    const bookings = await Booking.find({ roomId, day });

    const teamIds = bookings.map((booking) => booking.teamId);

    const teams = await Team.find({ _id: { $in: teamIds } });

    const teamsWithBookings = teams.map((team) => {
      const teamBookings = bookings.filter((booking) =>
        booking.teamId.equals(team._id)
      );
      return { ...team.toObject(), bookings: teamBookings };
    });

    res.json(teamsWithBookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
