import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  bio: String,
  avatarUrl: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);