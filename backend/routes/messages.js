const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      message,
      starred: false,
      read: false
    });

    // Save message
    const savedMessage = await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: savedMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get a specific message
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle star status
router.post('/:id/star', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.starred = !message.starred;
    await message.save();
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send reply to a message
router.post('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Add reply to message
    if (!message.replies) {
      message.replies = [];
    }
    
    message.replies.push({
      content: reply,
      createdAt: new Date()
    });
    
    // Mark as read when replied
    message.read = true;
    
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;