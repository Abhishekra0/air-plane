// db.js
import mongoose from 'mongoose';

const url = 'mongodb+srv://<db_username>:<db_password>@cluster0.ayncc9l.mongodb.net/airplaneDB';
// ⚠️ Replace <db_username> and <db_password> with your actual MongoDB Atlas credentials.

async function connectToDatabase() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    throw error;
  }
}

export default connectToDatabase;
