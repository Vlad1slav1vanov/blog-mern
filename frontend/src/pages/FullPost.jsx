import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import ReactMarkdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import dayjs from "dayjs";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const userData = useSelector((state) => state.auth.data);
  const {id} = useParams();

  const getComments = async () => {
    try {
      const response = await axios.get(`/${id}/comments`);
      setComments([...response.data.data]);
      console.log(comments);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при получении комментариев');
    }
  };

  const getFullPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setData(response.data);
      setIsLoading(false);
    } catch(err) {
      console.warn(err);
      alert('Ошибка при получении статьи');
    }
  };

  React.useEffect(() => {
    getFullPost()
    getComments()
  }, [])

  if (isLoading) {
    return (
      <Post isLoading={isLoading} isFullPost={true}/>
    )
  }

  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:9000${data.imageUrl}` : ''}
        user={data.user}
        createdAt={dayjs(data.createdAt).format('DD.MM.YY, HH:mm')}
        viewsCount={data.viewsCount}
        commentsCount={data.comments.length}
        tags={data.tags}
        isFullPost
      >
      <ReactMarkdown 
      children={data.text}
      />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={false}
      >
        <Index 
        postId={id} 
        getComments={getComments}
        userData={userData} 
        />
      </CommentsBlock>
    </>
  );
};
