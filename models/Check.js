import mongoose from 'mongoose';

const checkSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  content: { type: String, required: true }, 
  result: { type: String, enum: ['Verified', 'Unverified', 'Partially Verified'], required: true }, 
  score: { type: Number, required: true },
  sources: [String],
  createdAt: { type: Date, default: Date.now },
  claimDate: { type: Date, required: true }, 
});

export default mongoose.model('Check', checkSchema);
