const { Team } = require('../models/team');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const teamList = await Team.find();
  if (!teamList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(teamList);
});

router.get('/:id', async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return res.status(500).json({ message: 'The team with the given ID was not found.' });
  }
  res.status(200).send(team);
});

router.post(`/`, async (req, res) => {
  let team = new Team({
    name: req.body.name,
    numberOfMembers: req.body.numberOfMembers
  });
  team = await team.save();

  if (!team) 
  return res.status(404).send("The team cannot be created");

  res.send(team);
});

module.exports = router;