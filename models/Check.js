import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: { type: String, required: true }, 
  result: { type: String, required: true },
  score: { type: Number, required: true },
  sources: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Check', checkSchema);
