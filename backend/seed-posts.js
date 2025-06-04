require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

const samplePosts = [
  {
    title: 'Portfolio Website Launch',
    description: 'A modern portfolio website built with React and Node.js',
    imageUrl: 'https://via.placeholder.com/800x600?text=Portfolio+Website',
    category: 'gallery',
    content: 'Showcasing my latest web development project.',
    likes: [],
    comments: []
  },
  {
    title: 'E-commerce Project',
    description: 'Full-stack e-commerce platform with React and MongoDB',
    imageUrl: 'https://via.placeholder.com/800x600?text=E-commerce+Project',
    category: 'gallery',
    content: 'A complete e-commerce solution with shopping cart and payment integration.',
    likes: [],
    comments: []
  },
  {
    title: 'Mobile App Development',
    description: 'React Native mobile application',
    imageUrl: 'https://via.placeholder.com/800x600?text=Mobile+App',
    category: 'gallery',
    content: 'Cross-platform mobile app development project.',
    likes: [],
    comments: []
  }
];

async function seedPosts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert sample posts
    const result = await Post.insertMany(samplePosts);
    console.log(`Added ${result.length} sample posts`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
}

seedPosts(); 