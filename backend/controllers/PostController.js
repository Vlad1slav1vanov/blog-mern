import mongoose from 'mongoose';
import PostModel from '../models/Post.js';

// TAGS

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги'
    });  
  }
}

// POSTS

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью'
    });   
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи'
    });  
  }
}

export const getWithHashtag = async (req, res) => {
  try {
    const hashtag = req.params.hashtag;
    const posts = await PostModel.find({ tags: { $in: [hashtag] } })
      .populate('user', 'fullName avatarUrl');
    res.json(posts);
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      message: 'Посты не найдены'
    }); 
  }
};

export const getPopulate = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .sort({ viewsCount: -1 })
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи'
    });  
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ).populate('comments.user', 'avatarUrl fullName');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {_id: postId}, 
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью'
    });
  }
}

// COMMENTS

export const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const text = req.body.text;

    const result = await PostModel.updateOne(
      { _id: postId },
      {
        $push: {
          comments: {
            user: userId,
            text: text,
            timestamps: Date.now(),
          },
        },
        $inc: {
          commentsCount: 1,
        },
      },
    );
           
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

export const getAllComments = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('comments.user', 'fullName avatarUrl');
    const allComments = posts.flatMap((post) => post.comments);
    res.status(200).json({
      data: allComments,
    })
  } catch (err) {
    res.status(404).json({
      message: "Комментарии не найдены"
    })
  }
}