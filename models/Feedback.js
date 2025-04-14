import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  checkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Check' },
  emoji: { type: String, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Feedback', feedbackSchema);
