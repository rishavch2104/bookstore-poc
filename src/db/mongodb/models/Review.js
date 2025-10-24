import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: Number, required: true, index: true },
    userId: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    title: { type: String },
    body: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ bookId: 1, createdAt: -1 });

export const ReviewModel =
  mongoose.models.Review || mongoose.model('Review', reviewSchema);
