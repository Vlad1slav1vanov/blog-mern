import express from 'express';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';


mongoose
  .connect('mongodb+srv://userblog:userblog1@cluster0.84kwvd0.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err))

const app = express();

app.use(express.json())

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(9000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('SERVER OK')
})