import mongoose from "mongoose";
import { CommentSchema } from "./Comment.js";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [String],
    imageUrl: String
  }, 
  {
  timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);