import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import process from 'process';
import fs from 'fs';
import cors from 'cors';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {UserController, PostController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';
import streamifier from 'streamifier';
import cloudinary from 'cloudinary';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err));

const app = express();

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     if (!fs.existsSync('uploads')) {
//       fs.mkdirSync('uploads');
//     }
//     cb(null, 'uploads');
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

const fileUpload = multer()

cloudinary.config({ 
  cloud_name: 'dq99jqkjr', 
  api_key: '145511759135425', 
  api_secret: 'vGmP5b8v0NDbsY2FVQl-whwJYL0' 
});

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors());

app.get('/', (req, res) => res.send('Hello!'));
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users/:id', UserController.getMe);

// app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
//   res.json({
//     url: `/uploads/${req.file.originalname}`,
//   });
// });

// app.post('/upload/avatar', upload.single('image'), (req, res) => {
//   res.json({
//     url: `/uploads/${req.file.originalname}`,
//   });
// });

app.post('/upload/avatar', fileUpload.single('image'), function (req, res, next) {
  let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.v2.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };

  const upload = async (req) => {
    try {
      let result = await streamUpload(req);
      console.log(result);
      res.status(200).json(result.secure_url);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  upload(req);
});

app.post('/upload', checkAuth, fileUpload.single('image'), function (req, res, next) {
  let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.v2.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };

  const upload = async (req) => {
    try {
      let result = await streamUpload(req);
      console.log(result);
      res.status(200).json(result.secure_url);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  upload(req);
});



app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/hashtag/:hashtag', PostController.getWithHashtag);
app.get('/posts/populate', PostController.getPopulate);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.patch('/:postId/comments', checkAuth, PostController.createComment);
app.get('/comments', PostController.getAllComments);

app.listen(process.env.PORT || 9000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('SERVER OK')
})