require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const postRoutes = require('./routes/post');
const portfolioRouter = require('./routes/portfolio');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/portfolio', portfolioRouter);

// Mount openai.mjs on its own base path
import('./routes/openai.mjs')
  .then((openaiModule) => {
    app.use('/api/openai', openaiModule.default);
  })
  .catch((err) => console.error('Error loading OpenAI routes:', err));

// Mount learningcenterai.mjs on a different base path to avoid conflicts
import('./routes/learningcenterai.mjs')
  .then((openaiModule) => {
    app.use('/api/openai/learningcenter', openaiModule.default);
  })
  .catch((err) => console.error('Error loading Learning Center OpenAI routes:', err));

// Connect to MongoDB and start the server after routes are set up
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));
