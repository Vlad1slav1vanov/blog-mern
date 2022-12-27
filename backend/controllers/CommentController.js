import CommentModel from "../models/Comment.js";
import jwt from "jsonwebtoken";
import checkAuth from "../utils/checkAuth.js";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    // Extract the JWT from the request headers
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, 'secret123');

    // Extract the user ID from the payload
    const userId = decoded._id;

    // Find the post using the postId from the request parameters
    const { postId } = req.params;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Create the new comment
    const { text } = req.body;
    const comment = new CommentModel({
      user: userId,
      text,
      post: postId,
    });
    await comment.save();

    // Push the new comment to the comments array of the post
    post.comments.push(comment);

    // Save the updated post to the database
    await post.save();

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};