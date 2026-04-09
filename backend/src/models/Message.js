import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emoji: { type: String, required: true, trim: true, maxlength: 8 }
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'document'], required: true },
    name: { type: String, trim: true, maxlength: 200 },
    size: { type: Number, min: 0 }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    text: { type: String, trim: true, maxlength: 4000, default: '' },
    mediaUrl: { type: String, default: '' },
    messageType: { type: String, enum: ['text', 'image', 'video', 'document'], default: 'text', index: true },
    attachments: [attachmentSchema],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    reactions: [reactionSchema],
    starredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedForEveryone: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    isEdited: { type: Boolean, default: false, index: true },
    editedAt: { type: Date, default: null },
    clientMessageId: { type: String, trim: true, index: true, sparse: true },
    isSpam: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ text: 'text' });
messageSchema.index({ senderId: 1, clientMessageId: 1 }, { unique: true, sparse: true });

export const Message = mongoose.model('Message', messageSchema);
