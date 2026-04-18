import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    profilePic: { type: String, default: '' },
    bio: { type: String, trim: true, maxlength: 160, default: '' },
    status: { type: String, trim: true, maxlength: 80, default: 'Available' },
    themePreference: { type: String, enum: ['light', 'dark', 'ocean', 'rose', 'whatsapp-green', 'business-blue', 'vibrant-purple', 'sunset-orange', 'cool-teal'], default: 'dark' },
    notificationsEnabled: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isBlocked: { type: Boolean, default: false, index: true },
    isVerified: { type: Boolean, default: true, index: true },
    lastSeen: { type: Date, default: Date.now, index: true },
    isOnline: { type: Boolean, default: false, index: true },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pushTokens: [{ type: String }],
    archivedChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    pinnedChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
  },
  { timestamps: true }
);

userSchema.index({ name: 'text', email: 'text' });

export const User = mongoose.model('User', userSchema);
