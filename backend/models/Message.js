const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  starred: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
messageSchema.index({ createdAt: -1 });
messageSchema.index({ email: 1 });
messageSchema.index({ starred: 1 });
messageSchema.index({ read: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;