import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/flgp';

async function connectToDatabase() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export default connectToDatabase;
