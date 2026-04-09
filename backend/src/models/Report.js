import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null, index: true },
    reason: { type: String, required: true, trim: true, maxlength: 250 },
    status: { type: String, enum: ['open', 'reviewed', 'closed'], default: 'open', index: true }
  },
  { timestamps: true }
);

reportSchema.index({ createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
