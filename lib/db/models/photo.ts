import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    default: '',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  mediaType: {
    type: String,
    enum: ['image', 'youtube-video'],
    default: 'image',
  },
  // For images
  imageUrl: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  // For YouTube videos
  youtubeUrl: {
    type: String,
  },
  youtubeVideoId: {
    type: String,
  },
  // Common fields
  caption: {
    type: String,
    default: '',
  },
  folder: {
    type: String,
    enum: ['pre-wedding', 'ceremony', 'reception', 'honeymoon', 'other'],
    default: 'other',
  },
  uploadedDate: {
    type: Date,
  },
  location: {
    type: String,
    default: '',
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Photo || mongoose.model('Photo', photoSchema);
