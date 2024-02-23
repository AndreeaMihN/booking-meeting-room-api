const Room = require('../models/room');
const express = require('express');
const router = express.Router();

router.get(`/`, async(req, res) =>{
    const roomList = await Room.find();
    if(!roomList){
        res.status(500).json({ success:false});
    }
    res.send(roomList);
});

router.post(`/`, (req, res) =>{
    const room = new Room({
        name : req.body.name, 
        description : req.body.description, 
        booked : req.body.booked, 
        capacity : req.body.capacity
    })
    room.save().then((createdRoom)=>{
        res.status(201).json(createdRoom)
    }).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

module.exports = router;
