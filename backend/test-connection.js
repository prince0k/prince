require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI format:', mongoURI?.replace(/\/\/[^:]+:[^@]+@/, '//username:password@'));
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      dbName: 'portfolio_db'
    });

    console.log('Connection successful!');
    console.log('Connected to host:', conn.connection.host);
    console.log('Database name:', conn.connection.db.databaseName);

    // Test write permission
    const testCollection = conn.connection.db.collection('connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('Write test successful');

    // Clean up
    await testCollection.deleteMany({ test: true });
    console.log('Cleanup successful');

    await conn.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    if (error.codeName) {
      console.error('Error code:', error.code);
      console.error('Error codeName:', error.codeName);
    }
    process.exit(1);
  }
}

testConnection(); 