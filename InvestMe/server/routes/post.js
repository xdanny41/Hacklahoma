// server/routes/post.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// Set up storage for file uploads (if needed for image/video posts)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to 'uploads' folder (make sure this folder exists)
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

/* 
   CREATE a new post 
   If you're using Firebase for media uploads, you'll pass the Firebase URL in the "mediaUrl" field.
   Otherwise, if using multer, you might accept a file upload.
*/
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Destructure title, content, and mediaUrl from the request body.
    const { title, content, mediaUrl } = req.body;

    // Validate that both title and content are provided.
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create the post using the user ID provided by authMiddleware.
    const newPost = new Post({
      userId: req.user.userId, // Ensure authMiddleware sets req.user.userId
      title,                   // Include title in the new post
      content,
      mediaUrl
    });

    await newPost.save();
    return res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* 
   LIKE a post 
   Increments the "likes" count by 1.
*/
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.status(200).json({ message: 'Post liked', likes: post.likes });
  } catch (error) {
    console.error('Error in /:id/like route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/* 
   GET all posts 
   Populates the userId field to display the username.
*/
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username');
    return res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET a single post by ID
router.get('/:id', async (req, res) => {
  try {
    // Find the post by its ID and populate user info if needed.
    const post = await Post.findById(req.params.id).populate('userId', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/* 
   Add comment to a post
*/
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ userId: req.user.userId, comment });
    await post.save();
    res.status(201).json({ message: 'Comment added', comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.userId', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
