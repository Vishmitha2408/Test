import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);