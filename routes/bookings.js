const { Booking } = require('../models/booking');
const { Room } = require('../models/room');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
  const bookingList = await Booking.find();
  if (!bookingList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(bookingList);
});

router.post(`/`, async (req, res) => {
    const room = await Room.findById(req.body.roomId);
    if (!room) return res.status(400).send('Invalid Room');

    let existingBooking = await Booking.findOne({ roomId: req.body.roomId });
    if (existingBooking) {
        let isUpdateRequired = false;
        let messages = [];

        if (!existingBooking.morningBooked && req.body.morningBooked) {
            existingBooking.morningBooked = true;
            isUpdateRequired = true;
        } else if (existingBooking.morningBooked) {
            messages.push('morning');
        }

        if (!existingBooking.afternoonBooked && req.body.afternoonBooked) {
            existingBooking.afternoonBooked = true;
            isUpdateRequired = true;
        } else if (existingBooking.afternoonBooked) {
            messages.push('afternoon');
        }

        if (!existingBooking.allDayBooked && req.body.allDayBooked) {
            existingBooking.allDayBooked = true;
            isUpdateRequired = true;
        } else if (existingBooking.allDayBooked) {
            messages.push('all-day');
        }

        if (isUpdateRequired) {
            existingBooking = await existingBooking.save();
            return res.send(existingBooking);
        }

        if (messages.length > 0) {
            const errorMessage = `The following slots are already booked: ${messages.join(', ')}`;
            return res.status(400).send(errorMessage);
        }

        return res.status(400).send('No update required');
    }

    let booking = new Booking({
        roomId: req.body.roomId,
        morningBooked: req.body.morningBooked,
        afternoonBooked: req.body.afternoonBooked,
        allDayBooked: req.body.allDayBooked,
    });
    booking = await booking.save();
    if (!booking) return res.status(500).send('The booking cannot be created!');

    return res.send(booking);
});



router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Booking Id');
    };
    const room = await Room.findById(req.body.roomId);
    if(!room) return res.status(400).send('Invalid Room');

    let booking = await Booking.findByIdAndUpdate(
        req.params.id, 
        {
            roomId: req.body.roomId, 
            morningBooked: req.body.morningBooked,
            afternoonBooked: req.body.afternoonBooked,
            allDayBooked: req.body.allDayBooked,
        },
        {
            new: true
        });

    if(!booking) return res.status(500).send('The booking cannot be updated');
    return res.send(booking);
});

router.get('/:roomId', async (req, res) => {
    try {
        const booking = await Booking.findOne({ roomId: req.params.roomId });
        if (!booking) {
            return res.send(['morning', 'afternoon', 'all-day']);
        }

        const falseSlots = [];
        if (!booking.morningBooked) {
            falseSlots.push('morning');
        }
        if (!booking.afternoonBooked) {
            falseSlots.push('afternoon');
        }
        if (!booking.allDayBooked) {
            falseSlots.push('all-day');
        }

        return res.send(falseSlots);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
