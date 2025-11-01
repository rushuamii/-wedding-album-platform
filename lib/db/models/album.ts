import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
  },
  
  // Wedding Details
  weddingDate: {
    type: Date,
  },
  location: {
    type: String,
    default: '',
  },
  coupleNames: {
    type: String,
    default: '',
  },

  // Visibility & Sharing
  isPublic: {
    type: Boolean,
    default: false,
  },
  publicToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  allowGuestUploads: {
    type: Boolean,
    default: false,
  },
  guestUploadToken: {
    type: String,
    unique: true,
    sparse: true,
  },

  // Stats
  photosCount: {
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

export default mongoose.models.Album || mongoose.model('Album', albumSchema);
