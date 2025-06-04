const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AdminProfile = require('../models/AdminProfile');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Message = require('../models/Message');

// Register admin (this should be used only once to create your admin account)
router.post('/register', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }

    const admin = new Admin({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    await admin.save();
    
    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Admin account created successfully',
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Protected routes (require authentication)

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = {
      totalPosts: await Post.countDocuments(),
      totalMessages: await Message.countDocuments(),
      recentPosts: await Post.find().sort({ createdAt: -1 }).limit(5),
      recentMessages: await Message.find().sort({ createdAt: -1 }).limit(5)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all messages
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new post
router.post('/posts', auth, async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin profile (protected route)
router.get('/admin/profile', auth, async (req, res) => {
  try {
    let profile = await AdminProfile.findOne();
    if (!profile) {
      profile = new AdminProfile({
        name: 'Admin',
        email: 'admin@example.com'
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update admin profile (protected route)
router.put('/admin/profile', auth, async (req, res) => {
  try {
    const profile = await AdminProfile.updateProfile(req.body);
    
    // Emit WebSocket event if io is available
    const io = req.app.get('io');
    if (io) {
      io.emit('profileUpdated', profile);
    }
    
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get public profile (unprotected route)
router.get('/profile', async (req, res) => {
  try {
    const profile = await AdminProfile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 