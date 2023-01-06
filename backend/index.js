import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import process from 'process';
import cors from 'cors';
import cloudinary from 'cloudinary';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {UserController, PostController, UploadController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err));

const app = express();

const fileUpload = multer()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_KEY, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
});

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors());

app.get('/', (req, res) => res.send('Hello!'));
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users/:id', UserController.getMe);

app.post('/upload/avatar', fileUpload.single('image'), UploadController.uploadImage);
app.post('/upload', checkAuth, fileUpload.single('image'), UploadController.uploadImage);

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