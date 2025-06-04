require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

// You can change these credentials to whatever you want
const ADMIN_EMAIL = 'your.email@example.com';  // Change this to your email
const ADMIN_PASSWORD = 'your_password';         // Change this to your password

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'portfolio'
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Updating existing admin credentials...');
    }

    // Create or update admin user
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        email: ADMIN_EMAIL,
        password: hashedPassword
      },
      { upsert: true, new: true }
    );

    console.log('----------------------------------------');
    console.log('Admin user created/updated successfully!');
    console.log('----------------------------------------');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('----------------------------------------');
    console.log('Please save these credentials securely!');
    console.log('----------------------------------------');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin(); 