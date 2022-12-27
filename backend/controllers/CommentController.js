import CommentModel from "../models/Comment.js";
import jwt from "jsonwebtoken";
import checkAuth from "../utils/checkAuth.js";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Токен отсутствует',
      });
    }

    const decoded = jwt.verify(token, 'secret123');

    const userId = decoded._id;

    const { postId } = req.params;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Пост не найден',
      });
    }

    const { text } = req.body;
    const comment = new CommentModel({
      user: userId,
      text,
      post: postId,
    });
    await comment.save();

    post.comments.push(comment);

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

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find();

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};