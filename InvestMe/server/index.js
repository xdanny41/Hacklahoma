// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Path to your auth.js file
const postRoutes = require('./routes/post');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes); 
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));

// Use the auth routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});