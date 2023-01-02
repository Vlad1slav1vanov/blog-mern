import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  try {
    const {postId} = req.params;
    const post = await PostModel.findOne({_id: postId});

    if (!post) {
      res.status(404).json({
        message: 'Пост не найден'
      })
    }

    const doc = new CommentModel({
      user: req.userId,
      post: postId,
      text: req.body.text,
    })

    doc.save();

    res.status(200).json({
      success: true,
      message: "Комментарий опубликован",
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Пост не найден'
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const {postId} = req.params;
    const post = await PostModel.findOne({_id: postId});

    if (!post) {
      res.status(404).json({
        message: 'Пост не найден'
      })
    }

    const comments = await CommentModel.find({post: postId}).populate('user', 'fullName avatarUrl')

    res.status(200).json({
      success: true,
      data: comments,
    })

  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Пост не найден'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user', 'fullName avatarUrl');

    res.status(200).json({
      success: true,
      data: comments,
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Комментарии не найдены'
    })
  }
}