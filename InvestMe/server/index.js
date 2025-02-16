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

// Dynamically import the OpenAI route (ES module) and mount it at /api/openai
import('./routes/openai.mjs')
  .then((openaiModule) => {
    app.use('/api/openai', openaiModule.default);
  })
  .catch((err) => console.error('Error loading OpenAI routes:', err));

// Connect to MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Use the auth routes
  app.use('/api/auth', authRoutes);

  // Test route
  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });
  
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));
