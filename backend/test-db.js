require('dotenv').config();
const mongoose = require('mongoose');
const About = require('./models/About');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected!');
    
    // Test About model
    console.log('\nTesting About model:');
    const about = await About.findOne();
    console.log('Current about content:', about);
    
    if (!about) {
      console.log('\nNo content found, creating test content...');
      const newAbout = await About.create({
        title: 'Test Title',
        description: 'Test Description',
        skills: ['Test Skill 1', 'Test Skill 2'],
        experience: [{
          title: 'Test Job',
          company: 'Test Company',
          period: '2023',
          description: 'Test Description'
        }]
      });
      console.log('Created test content:', newAbout);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB(); 