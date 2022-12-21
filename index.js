import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb+srv://userblog:userblog1@cluster0.84kwvd0.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB Error: ' + err))

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.post('/auth/login', (req, res) => {
  console.log(req.body)

  if (req.body.email === 'test@test.ru') {
    const token = jwt.sign({
      email: req.body.email,
      fullName: 'Владислав Иванов'
    }, 'secret123')
  }

  res.json({
    success: true,
    token,
  })
})

app.listen(9000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('SERVER OK')
})