import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  claim: { type: String, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Report', reportSchema);
