const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop legacy index username_1 if it exists in the users collection
    try {
      const usersCollection = conn.connection.db.collection('users');
      const indexes = await usersCollection.indexes();
      const hasUsernameIndex = indexes.some((idx) => idx.name === 'username_1');
      if (hasUsernameIndex) {
        await usersCollection.dropIndex('username_1');
        console.log('🧹 Dropped legacy username_1 index from users collection');
      }
    } catch (err) {
      console.warn('⚠️ Could not check/drop legacy index:', err.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
