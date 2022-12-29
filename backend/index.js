import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import {registerValidation, loginValidation, postCreateValidation, commentCreateValidation} from './validations.js';
import {UserController, PostController, CommentController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';

mongoose
  .connect('mongodb+srv://userblog:userblog1@cluster0.84kwvd0.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users/:id', UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/upload/avatar', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/:postId/comments', commentCreateValidation, CommentController.create);
app.get('/comments', CommentController.getAll);
app.get('/:postId/comments', CommentController.getComments)

app.listen(9000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('SERVER OK')
})