import mongoose from 'mongoose';

const ProfileViewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
ProfileViewSchema.index({ username: 1, date: 1 }, { unique: true });

export default mongoose.models.ProfileView || mongoose.model('ProfileView', ProfileViewSchema);