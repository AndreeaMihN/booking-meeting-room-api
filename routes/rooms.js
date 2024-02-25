const { Room } = require('../models/room');
const { Office } = require('../models/office');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) =>{
    const roomList = await Room.find().populate('office');
    if(!roomList){
        res.status(500).json({ success:false});
    }
    res.send(roomList);
});

router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id).populate('office');
    if (!room) {
      return res.status(500).json({ message: 'The room with the given ID was not found.' });
    }
    res.status(200).send(room);
  });
  

router.post(`/`, async (req, res) => {
    const office = await Office.findById(req.body.office);
    if(!office) return res.status(400).send('Invalid Office');

    let room = new Room({
        name: req.body.name, 
        description: req.body.description, 
        capacity: req.body.capacity,
        office: req.body.office,
        floor: req.body.floor,
    })
    room = await room.save();
    if(!room)
    return res.status(500).send('The room cannot be created!');

    return res.send(room);
});

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Room Id');
    };
    const office = await Office.findById(req.body.office);
    if(!office) return res.status(400).send('Invalid Office');

    const room = await Room.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name, 
            description: req.body.description, 
            capacity: req.body.capacity,
            office: req.body.office,
            floor: req.body.floor
        },
        {
            new: true
        });

    if(!room) return res.status(500).send('The product cannot be updated');
    return res.send(room);
});

router.delete('/:id', async (req, res) => {
    Room.findByIdAndDelete(req.params.id).then((deletedRoom) => {
      if (!deletedRoom) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      res.status(200).json({ success: true, message: 'The room is deleted!' });
    }).catch((err) => {
      res.status(500).json({ success: false, error: 'Internal server error' });
    })
  });
  
//   router.get('/available-rooms', async (req, res) => {
//     const { start, end } = req.query;

//     if (!start || !end) {
//         return res.status(400).json({ success: false, message: 'Start and end parameters are required for the interval' });
//     }

//     try {
//         const availableRooms = await Room.find({
//             bookedSlots: {
//                 $not: {
//                     $elemMatch: {
//                         $or: [
//                             { $gte: new Date(start), $lt: new Date(end) },
//                             { $lt: new Date(start), $gte: new Date(end) }
//                         ]
//                     }
//                 }
//             }
//         }).populate('office');

//         res.status(200).json({ success: true, availableRooms });
//     } catch (error) {
//         console.error('Error while fetching available rooms:', error);
//         res.status(500).json({ success: false, error: 'Internal server error. Failed to fetch available rooms.' });
//     }
// });

module.exports = router;