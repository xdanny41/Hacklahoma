// server/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  mediaUrl: { 
    type: String 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Post', postSchema);
