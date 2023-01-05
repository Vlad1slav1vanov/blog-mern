import React from 'react';
import {useForm} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from 'react-router-dom';
import axios from '../../axios';
import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = React.useState('');
  const fileInput = React.useRef(null);

  const handleChangeFile = async (evt) => {
    try {
      const formData = new FormData();
      const file = evt.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/upload/avatar', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const { 
    register, 
    handleSubmit, 
    formState: { 
      errors, 
      isValid 
    }} = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      avatarUrl: imageUrl,
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = dispatch(fetchRegister({...values, avatarUrl: imageUrl}));

    if (!data.payload) {
      alert('Не удалось зарегистрироваться')
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar
        src={imageUrl}
        sx={{ width: 100, height: 100 }} 
        />
        <input
        ref={fileInput}
        type="file"
        onChange={handleChangeFile}
        hidden
        />
        <Button
        width={100}
        onClick={() => fileInput.current.click()}
        >
          Загрузить аватар
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          value={imageUrl}
          onChange={(evt) => setImageUrl(evt.target.value)}
          {...register('avatarUrl')}
          hidden
        />
        <TextField
        className={styles.field}
        label="Полное имя"
        type="text"
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', {required: 'Укажите полное имя'})}
        fullWidth
        />
        <TextField
        className={styles.field}
        label="E-Mail"
        type="email"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email', {required: 'Укажите почту'})}
        fullWidth
        />
        <TextField 
        className={styles.field} 
        label="Пароль"
        type='password'
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', {required: 'Укажите пароль'})}
        fullWidth 
        />
        <Button 
        disabled={!isValid} 
        type='submit' 
        size="large" 
        variant="contained" 
        fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
