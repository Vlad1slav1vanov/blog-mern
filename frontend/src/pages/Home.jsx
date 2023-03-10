import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import axios from '../axios';
import dayjs from 'dayjs';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPostsLoading = posts.status === 'loading';
  const items = isPostsLoading ? [...Array(5)] : posts.items;
  const [comments, setComments] = React.useState([])
  const isTagsLoading = tags.status === 'loading';
  const [tab, setTab] = React.useState(0);

  const getNewPosts = () => {
    setTab(0);
    dispatch(fetchPosts());
  };

  const getPopulatePosts = () => {
    setTab(1);
    dispatch(fetchPosts())
  };

  const getComments = async () => {
    try {
      const response = (await axios.get('/comments')).data.data
      setComments(response)
    } catch (err) {
      alert('Не удалось загрузить список комментариев')
    }
  };

  React.useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
    getComments()
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tab}>
        <Tab onClick={getNewPosts} label="Новые" />
        <Tab onClick={getPopulatePosts} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
      <Grid xs={8} item>
          {items.map((obj, index) => 
            isPostsLoading ? (
            <Post key={index} isLoading={true} />
            ) : (
            <Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? obj.imageUrl : ''}
              user={obj.user}
              createdAt={dayjs(obj.createdAt).format('DD.MM.YY, HH:mm')}
              viewsCount={obj.viewsCount}
              commentsCount={obj.commentsCount}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
          ),
         )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
