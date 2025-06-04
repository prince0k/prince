require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const AdminProfile = require('./models/AdminProfile');

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing admin accounts and profiles
    await Admin.deleteMany({});
    await AdminProfile.deleteMany({});
    console.log('Deleted existing admin accounts and profiles');

    // Create new admin account
    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123'  // This will be hashed by the pre-save middleware
    });

    await admin.save();
    console.log('Created new admin account');

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
    console.log('Created new admin profile');

    console.log('\nAdmin account reset successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin(); 