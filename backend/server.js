const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());
app.use('/Images', express.static(path.join(__dirname, 'Images')));
// Connect to MongoDB
mongoose.connect('mongodb+srv://naiksahil660:zFOd8pkvMqhyUslY@cluster0.3mp1f5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mobile_gallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema for mobile data
const mobileSchema = new mongoose.Schema({
    name: String,
    price: String,
    filePath: String
});

// Create model from schema
const Mobile = mongoose.model('Mobile', mobileSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save uploaded files to the Images folder
    cb(null, './Images');
  },
  filename: function (req, file, cb) {
    // Generate unique filename using current timestamp and original file name
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize Multer middleware with storage configuration
const upload = multer({ storage });

// POST endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Log the uploaded file details
  console.log('Uploaded file:', req.file);

  // Access additional form data like name and price from req.body
  const { name, price } = req.body;
  console.log('Name:', name);
  console.log('Price:', price);
  
  // Save uploaded data to MongoDB
  Mobile.create({ name, price, filePath: req.file.path })
    .then(mobile => {
      console.log('Mobile added successfully:', mobile);
      res.status(200).json({ 
        message: 'File uploaded successfully', 
        mobile: mobile
      });
    })
    .catch(err => {
      console.error('Error adding mobile:', err);
      res.status(500).json({ error: 'Failed to add mobile' });
    });
});

// GET endpoint to fetch added data
app.get('/added-data', (req, res) => {
  // Fetch data from MongoDB
  Mobile.find({})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.error('Error fetching added data:', err);
      res.status(500).json({ error: 'Failed to fetch added data' });
    });
});

// Delete endpoint to clear all data
app.delete('/clear-data', (req, res) => {
    Mobile.deleteMany({})
        .then(() => {
            console.log('All mobile data cleared successfully');
            res.status(200).json({ message: 'All mobile data cleared successfully' });
        })
        .catch(err => {
            console.error('Error clearing mobile data:', err);
            res.status(500).json({ error: 'Failed to clear mobile data' });
        });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
