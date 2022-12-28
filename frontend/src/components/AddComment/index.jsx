import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";

export const Index = ({postId, getComments, userData}) => {
  const [comment, setComment] = React.useState('');

  const onSubmit = () => {
    try {
      const text = {text: comment};
      axios.post(`/${postId}/comments`, text);   
      setComment('');
      getComments();
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании комментария!');
    }
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData.avatar}
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
