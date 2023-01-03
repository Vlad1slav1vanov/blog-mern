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
  const [isLoading, setIsLoading] = React.useState(true);
  const userData = useSelector((state) => state.auth.data);
  const {id} = useParams();

  const getFullPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setData(response.data);
      setIsLoading(false);
    } catch(err) {
      console.warn(err);
      alert('Ошибка при получении поста');
    }
  };

  React.useEffect(() => {
    getFullPost()
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
        tags={data.tags}
        isFullPost
      >
      <ReactMarkdown 
      children={data.text}
      />
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={isLoading}
      >
        <Index 
        postId={id}
        userData={userData}
        getPost={getFullPost}
        />
      </CommentsBlock>
    </>
  );
};
