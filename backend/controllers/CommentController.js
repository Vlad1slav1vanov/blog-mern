import CommentModel from "../models/Comment.js";
import jwt from "jsonwebtoken";
import checkAuth from "../utils/checkAuth.js";
import UserModel from "../models/User.js";
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
    const userData = await UserModel.findById(userId);

    const {postId} = req.params
    const {text} = req.body

    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(400).json({
        success: false,
        message: 'Пост не найден!'
      })
    };
   
    const doc = new CommentModel({
      user: userId,
      post: postId,
      text,
    });

    doc.save();

    res.status(200).json({
      success: true,
      message: 'Комментарий добавлен',
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
    const comments = await CommentModel.find().populate('user', '-passwordHash -email');

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