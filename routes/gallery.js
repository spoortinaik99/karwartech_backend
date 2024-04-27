// routes/mobileRoutes.js
const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/moc');

// Route to handle form submission
router.post('/', mobileController.addMobile);


// Route to fetch all mobiles
router.get('/', mobileController.getAllMobiles);

module.exports = router;
