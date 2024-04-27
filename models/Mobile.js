const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
    title: String,
    price: String,
    image: String
});

module.exports = mongoose.model('Mobile', mobileSchema);