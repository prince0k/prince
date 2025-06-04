const express = require('express');
const router = express.Router();
const About = require('../models/About');
const auth = require('../middleware/auth');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'About API is working!' });
});

// Get about content
router.get('/', async (req, res) => {
  console.log('GET /api/about - Fetching about content');
  try {
    let about = await About.findOne();
    console.log('Found about content:', about);
    
    // If no content exists, create default content
    if (!about) {
      console.log('No content found, creating default content');
      about = await About.create({
        title: 'Welcome to my portfolio',
        description: 'This is a brief description about me.',
        skills: ['Web Development'],
        experience: [{
          title: 'Developer',
          company: 'Company Name',
          period: '2023 - Present',
          description: 'Working as a developer.'
        }]
      });
      console.log('Created default content:', about);
    }
    
    res.json(about);
  } catch (error) {
    console.error('Error in GET /api/about:', error);
    res.status(500).json({ message: 'Error fetching about content', error: error.message });
  }
});

// Update about content (protected route)
router.put('/', auth, async (req, res) => {
  console.log('PUT /api/about - Updating about content');
  console.log('Request body:', req.body);
  try {
    const { title, description, skills, experience } = req.body;
    
    let about = await About.findOne();
    console.log('Found existing content:', about);
    
    if (!about) {
      console.log('No existing content, creating new');
      about = new About({
        title,
        description,
        skills,
        experience
      });
    } else {
      console.log('Updating existing content');
      about.title = title;
      about.description = description;
      about.skills = skills;
      about.experience = experience;
    }
    
    await about.save();
    console.log('Saved content:', about);
    res.json(about);
  } catch (error) {
    console.error('Error in PUT /api/about:', error);
    res.status(500).json({ message: 'Error updating about content', error: error.message });
  }
});

module.exports = router; 