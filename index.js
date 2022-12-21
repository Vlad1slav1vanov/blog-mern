import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

mongoose
  .connect('mongodb+srv://userblog:userblog1@cluster0.84kwvd0.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err))

const app = express();

app.use(express.json())

app.post('/auth/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json({
    success: true
  })
})

app.listen(9000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('SERVER OK')
})