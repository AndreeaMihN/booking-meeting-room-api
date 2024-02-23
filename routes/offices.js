const { Office } = require('../models/office');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const officeList = await Office.find();
  if (!officeList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(officeList);
});

router.get('/:id', async (req, res) => {
  const office = await Office.findById(req.params.id);
  if (!office) {
    return res.status(500).json({ message: 'The office with the given ID was not found.' });
  }
  res.status(200).send(office);
});

router.post(`/`, async (req, res) => {
  let office = new Office({
    name: req.body.name,
    country: req.body.country,
    city: req.body.city,
    address: req.body.address,
  });
  office = await office.save();

  if (!office) 
  return res.status(404).send("The office cannot be created");

  res.send(office);
});

router.delete('/:id', async (req, res) => {
  Office.findByIdAndDelete(req.params.id).then((deletedOffice) => {
    if (!deletedOffice) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }
    res.status(200).json({ success: true, message: 'The office is deleted!' });
  }).catch((err) => {
    res.status(500).json({ success: false, error: 'Internal server error' });
  })
});

module.exports = router;
