'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Divider, Button } from '@mui/material';
import { firestore, auth } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function MyPosts() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(''); // State for storing username
  const [posts, setPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPosts = async (userId) => {
      // Fetch user posts
      const postsQuery = query(collection(firestore, 'inventory'), where('userId', '==', userId));
      const querySnapshot = await getDocs(postsQuery);
      const userPosts = [];
      let likesCount = 0;
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        userPosts.push({
          id: doc.id,
          ...postData,
        });
        likesCount += postData.count || 0;
      });
      setPosts(userPosts);
      setTotalLikes(likesCount);
    };

    const fetchUsername = async (userId) => {
      // Fetch username from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username);
      } else {
        setUsername('Anonymous');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserPosts(currentUser.uid);
        fetchUsername(currentUser.uid);
      } else {
        setUser(null);
        setPosts([]);
        setTotalLikes(0);
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemovePost = async (postId) => {
    try {
      await deleteDoc(doc(firestore, 'inventory', postId));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error removing post: ", error);
    }
  };

  if (!user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <Typography variant="h5">You must be logged in to view your posts.</Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f5f5f5', overflowY: 'auto', position: 'relative' }}
    >
      {/* Go to Home Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/')}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        Go to Home
      </Button>

      <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
        My Posts
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome, {username}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Likes: {totalLikes}
      </Typography>
      <Grid container spacing={2} width="90%" maxWidth={1200}>
        {posts.map(({ id, name, count, imageUrl }) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Card sx={{ height: '100%' }}>
              {imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt={name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {name}
                </Typography>
                <Typography variant="body1">
                  Likes: {count}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemovePost(id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
