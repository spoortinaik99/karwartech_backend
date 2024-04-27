// controllers/mobileController.js
const Mobile = require('../models/Mobile');

// Controller for handling form submission
exports.addMobile = async (req, res) => {
    try {
        console.log(req.body)
        const { title, price, image } = req.body;
        const newMobile = await Mobile.create({ title, price, image });
        res.status(201).json({ message: 'Mobile added successfully', mobile: newMobile });
    } catch (error) {
        console.error('Error adding mobile:', error);
        res.status(500).json({ error: 'Failed to add mobile' });
    }
};
// Controller for fetching all mobiles
exports.getAllMobiles = async (req, res) => {
    try {
        const mobiles = await Mobile.find();
        res.json(mobiles);
    } catch (error) {
        console.error('Error fetching mobiles:', error);
        res.status(500).json({ error: 'Failed to fetch mobiles' });
    }
};
