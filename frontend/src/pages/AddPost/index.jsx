import React from 'react';
import {useSelector} from 'react-redux';
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (evt) => {
    try {
      const formData = new FormData();
      const file = evt.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/upload', formData);
      setImageUrl(data.url)
      console.log(imageUrl)
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        text,
        tags

      }

      const {data} = await axios.post('/posts', fields);
      const id = data._id;
      navigate(`/posts/${id}`)
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи!');
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
      uniqueId: "myUniqueId",
    }),
    [],
  );

  if (window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button 
      onClick={() => inputFileRef.current.click()} 
      variant="outlined" 
      size="large"
      >
        Загрузить превью
      </Button>
      <input 
      ref={inputFileRef} 
      type="file" 
      onChange={handleChangeFile} 
      hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:9000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
      classes={{ root: styles.title }}
      variant="standard"
      placeholder="Заголовок статьи..."
      value={title}
      onChange={evt => setTitle(evt.target.value)}
      fullWidth
      />
      <TextField 
      classes={{ root: styles.tags }} 
      variant="standard" 
      placeholder="Тэги" 
      fullWidth 
      value={tags}
      onChange={evt => setTags(evt.target.value)}
      />
      <SimpleMDE
      className={styles.editor} 
      value={text} 
      onChange={onChange} 
      options={options} 
      />
      <div className={styles.buttons}>
        <Button 
        onClick={onSubmit} 
        size="large" 
        variant="contained"
        >
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
