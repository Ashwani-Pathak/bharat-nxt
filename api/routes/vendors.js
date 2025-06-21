const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vendor = require('../models/Vendor');

// Add vendor routes here

// @route   POST api/vendors
// @desc    Create a new vendor
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newVendor = new Vendor({
      ...req.body,
      // You might want to associate the vendor with the user who created it
      // createdBy: req.user.userId 
    });

    const vendor = await newVendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 