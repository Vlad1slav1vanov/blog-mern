import React from 'react';
import {useSelector} from 'react-redux';
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';


import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');

  const [hashtags, setHashtags] = React.useState('');
  const [validError, setValidError] = React.useState(false);

  const [imageUrl, setImageUrl] = React.useState('');
  const isEditing = Boolean(id);
  const inputFileRef = React.useRef(null);

  const sliceIntoHashtags = (str) => {
    const hashtagRegex = /#[a-zA-Zа-яА-Я0-9]+/g;
    return str.match(hashtagRegex) || [];
  }

  const handleChangeTags = (event) => {
    const hashtagRegex = /^\s*(#[a-zA-Zа-яА-Я0-9]*\s*)*\s*$/;
    const inputValue = event.target.value;
    setHashtags(inputValue);
    setValidError(inputValue.trim() !== '' && !hashtagRegex.test(inputValue));
  };

  const handleChangeFile = async (evt) => {
    try {
      const formData = new FormData();
      const file = evt.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/upload', formData);
      setImageUrl(data.url)
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
      const tags = sliceIntoHashtags(hashtags)

      const fields = {
        title,
        imageUrl,
        text,
        tags
      }

      const {data} = isEditing 
      ? 
      await axios.patch(`/posts/${id}`, fields) 
      : 
      await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`)
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

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
        .then(({data}) => {
          setTitle(data.title)
          setHashtags(data.tags)
          setText(data.text)
          setImageUrl(data.imageUrl)
        })
        .catch(err => {
          console.warn(err)
          alert('Ошибка при получении статьи')
        })

    }
  }, [])

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
      hidden 
      />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img 
          className={styles.image} 
          src={`http://localhost:9000${imageUrl}`} 
          alt="Uploaded" 
          />
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
      error={validError}
      helperText={validError ? 'Хештеги начинаются с символа # и разделяются пробелами, посторонние символы недопустимы!' : ''} 
      variant="standard" 
      placeholder="Тэги" 
      fullWidth 
      value={hashtags}
      onChange={handleChangeTags}
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
        disabled={Boolean(validError)}
        >
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
