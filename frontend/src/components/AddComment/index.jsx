import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";

export const Index = ({postId, userData, getPost}) => {
  const [comment, setComment] = React.useState('');

  const onSubmit = async () => {
    try {
      const reqBody = {
        text: comment
      }
      await axios.patch(`/${postId}/comments`, reqBody);
      getPost();
      setComment('');
    } catch (err) {
      console.warn('Не удалось опубликовать комментарий')
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData ? `https://blog-backend-fkzj.onrender.com${userData.avatarUrl}` : ''}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={comment}
            onChange={(evt) => setComment(evt.target.value)}
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
