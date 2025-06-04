require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const AdminProfile = require('./models/AdminProfile');

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin account
    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123'  // Change this to your desired password
    });

    await admin.save();
    console.log('Admin account created successfully');

    // Create admin profile
    const profile = new AdminProfile({
      name: 'Admin',
      email: 'admin@example.com',
      bio: 'Portfolio Administrator',
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        email: 'admin@example.com'
      },
      homePageContent: {
        title: 'Full Stack Developer',
        subtitle: 'Creating modern web applications',
        description: 'Welcome to my portfolio'
      }
    });

    await profile.save();
    console.log('Admin profile created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin(); 