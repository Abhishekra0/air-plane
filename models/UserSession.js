// models/UserSession.js
import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  // Other fields related to the session can be added here
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

export default UserSession;
