require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const updateAdmin = async (email, password) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'portfolio'
    });
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await Admin.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword
      },
      { upsert: true, new: true }
    );

    console.log('----------------------------------------');
    console.log('Admin credentials updated successfully!');
    console.log('----------------------------------------');
    console.log('New Email:', email);
    console.log('New Password:', password);
    console.log('----------------------------------------');
    console.log('Please save these credentials securely!');
    console.log('----------------------------------------');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
};

// Ask for credentials
rl.question('Enter admin email: ', (email) => {
  rl.question('Enter admin password: ', async (password) => {
    await updateAdmin(email, password);
  });
}); 