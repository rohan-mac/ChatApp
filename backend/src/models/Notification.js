import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true
    },
    title: { type: String, trim: true, maxlength: 200, default: '' },
    message: { type: String, trim: true, maxlength: 4000, default: '' },
    type: { type: String, trim: true, maxlength: 50, default: 'message', index: true },
    read: { type: Boolean, default: false, index: true },
    // Optional linkage to message for idempotency / debugging
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    // Optional linkage to FCM delivery for troubleshooting
    fcmMessageId: { type: String, default: '' }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ chatId: 1, createdAt: -1 });

// Prevent duplicates per recipient/message
notificationSchema.index(
  { userId: 1, messageId: 1, type: 1 },
  { unique: true, sparse: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);

