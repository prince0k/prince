const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    enum: ['gallery', 'blog', 'feed'],
    required: true
  },
  content: {
    type: String,
    required: function() { return this.category === 'blog'; }
  },
  likes: [{
    type: String, // Store email of users who liked
    ref: 'User'
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ title: 'text', description: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 