require('dotenv').config();
const mongoose = require('mongoose');

async function verifyCredentials() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    // Parse the connection string
    const uriPattern = /mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/;
    const match = mongoURI.match(uriPattern);

    if (!match) {
      console.error('Error: Invalid MongoDB connection string format');
      console.log('Expected format: mongodb+srv://<username>:<password>@<cluster>');
      process.exit(1);
    }

    const [, username, password, cluster] = match;

    console.log('Connection String Analysis:');
    console.log('- Username:', username);
    console.log('- Password:', '*'.repeat(password.length));
    console.log('- Cluster:', cluster);
    //console.log('- Database:', database);
    console.log('\nAttempting connection...');

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('\nConnection successful!');
    console.log('Connected to MongoDB cluster:', conn.connection.host);
    // console.log('Database:', conn.connection.db.databaseName);

    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.log('\nPossible solutions:');
      console.log('1. Verify your username and password are correct');
      console.log('2. Check if your IP address is whitelisted in MongoDB Atlas');
      console.log('3. Ensure your MongoDB user has the correct permissions');
    }
    
    process.exit(1);
  }
}

verifyCredentials(); 