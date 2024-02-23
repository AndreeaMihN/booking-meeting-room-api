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
    if(!room) return res.status(400).send('Invalid Room');

    let booking = new Booking({
        roomId: req.body.roomId, 
        startTime: req.body.startTime, 
        endTime: req.body.endTime
    })
    booking = await booking.save();
    if(!booking)
    return res.status(500).send('The booking cannot be created!');

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
            startTime: req.body.startTime, 
            endTime: req.body.endTime
        },
        {
            new: true
        });

    if(!booking) return res.status(500).send('The booking cannot be updated');
    return res.send(booking);
});

//implement a better solution for this route!!
router.get('/is-interval-free', async (req, res) => {
    let { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Start and end parameters are required for the interval' });
    }

    try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Please provide dates in ISO 8601 format.' });
        }

        start = startDate.toISOString();
        end = endDate.toISOString();

        const overlappingBookings = await Booking.find({
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        if (overlappingBookings.length === 0) {
            res.status(200).json({ success: true, message: 'Interval is free' });
        } else {
            res.status(200).json({ success: true, message: 'Interval is not free, there are bookings in this interval' });
        }
    } catch (error) {
        console.error('Error while checking interval:', error);
        res.status(500).json({ success: false, error: 'Internal server error. Failed to check interval.' });
    }
});

module.exports = router;
