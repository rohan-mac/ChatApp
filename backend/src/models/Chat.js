import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['direct', 'group'], default: 'direct', index: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    title: { type: String, trim: true, maxlength: 120, default: '' },
    description: { type: String, trim: true, maxlength: 300, default: '' },
    avatar: { type: String, default: '' },
    lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    archivedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1, updatedAt: -1 });
chatSchema.index({ title: 'text', description: 'text' });

export const Chat = mongoose.model('Chat', chatSchema);
