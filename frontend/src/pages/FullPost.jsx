import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { fetchComments } from "../redux/slices/posts";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const {id} = useParams();

  const getFullPost = () => {
    axios.get(`/posts/${id}`)
    .then(res => {
      setData(res.data)
      setIsLoading(false)
    })
    .catch(err => {
      console.warn(err)
      alert('Ошибка при получении статьи')
    })
  }

  const getComments = () => {
    axios.get(`/${id}/comments`)
    .then(res => {
      setComments(res.data.data)
    })
    .catch(err => {
      console.warn(err)
      alert('Ошибка при получении комментариев')
    })
  }

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
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
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
        <Index />
      </CommentsBlock>
    </>
  );
};
