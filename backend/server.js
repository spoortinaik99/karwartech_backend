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
mongoose.connect('mongodb+srv://naiksahil660:zFOd8pkvMqhyUslY@cluster0.3mp1f5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mobile_gallery',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema for mobile data
const mobileSchema = new mongoose.Schema({
  name: String,
  price: String,
  filePaths: [String] // Store multiple file paths in an array
});

// Define schema for slider images
const sliderSchema = new mongoose.Schema({
  filePaths: [String] // Store multiple file paths in an array
});

// Create models from schemas
const Mobile = mongoose.model('Mobile', mobileSchema);
const Slider = mongoose.model('Slider', sliderSchema);

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

// POST endpoint to handle mobile file upload
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    // Access additional form data like name and price from req.body
    const { name, price } = req.body;
  
    // Extract file paths from req.files
    const filePaths = req.files.map(file => file.path);
  
    // Create a new mobile object with the provided data
    const mobile = await Mobile.create({ name, price, filePaths });
  
    console.log('Mobile added successfully:', mobile);
  
    res.status(200).json({ 
      message: 'Files uploaded successfully', 
      mobile: mobile
    });
  } catch (err) {
    console.error('Error adding mobile:', err);
    res.status(500).json({ error: 'Failed to add mobile' });
  }
});

// POST endpoint to handle slider image upload
app.post('/upload-slider', upload.array('sliderImages', 6), async (req, res) => {
  try {
    // Extract file paths from req.files
    const filePaths = req.files.map(file => file.path);
  
    // Create a new slider object with the provided data
    const slider = await Slider.create({ filePaths });
  
    console.log('Slider images added successfully:', slider);
  
    res.status(200).json({ 
      message: 'Slider images uploaded successfully', 
      slider: slider
    });
  } catch (err) {
    console.error('Error adding slider images:', err);
    res.status(500).json({ error: 'Failed to add slider images' });
  }
});

// GET endpoint to fetch added data
app.get('/added-data', async (req, res) => {
  try {
    // Fetch data from MongoDB
    const data = await Mobile.find({});
  
    // Send response with fetched data
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching added data:', err);
    res.status(500).json({ error: 'Failed to fetch added data' });
  }
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

// Delete individual mobile item
app.delete('/mobiles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mobile item by ID and delete it
    const deletedMobile = await Mobile.findByIdAndDelete(id);
    if (!deletedMobile) {
      return res.status(404).json({ error: 'Mobile item not found' });
    }
    console.log('Mobile item deleted successfully:', deletedMobile);
    res.status(200).json({ message: 'Mobile item deleted successfully', mobile: deletedMobile });
  } catch (err) {
    console.error('Error deleting mobile item:', err);
    res.status(500).json({ error: 'Failed to delete mobile item' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
