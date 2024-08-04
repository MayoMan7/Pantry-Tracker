'use client';

import { Box, Typography, Button, Tabs, Tab, Paper, Container } from "@mui/material";
import SignUp from "../components/SignUp";  // Ensure the path is correct
import Login from "../components/Login";    // Ensure the path is correct
import Logout from "../components/Logout";  // Ensure the path is correct
import { auth, firestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [value, setValue] = useState(0); // For Tabs
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch username from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      } else {
        setUsername('');
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push('/account');
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleViewMyPosts = () => {
    router.push('/account/MyPosts');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f5f5f5', overflowY: 'auto', position: 'relative' }}
    >
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

      <Container maxWidth="sm">
        <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom align="center">
          SnapShare - Account
        </Typography>
        
        {user ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Welcome, {username || user.email}
            </Typography>
            <Logout onSignOut={handleSignOut} />
            {/* Removed duplicate "Go to Home" button */}
            <Button variant="contained" color="secondary" onClick={handleViewMyPosts} sx={{ marginTop: 2 }}>
              View My Posts
            </Button>
          </Box>
        ) : (
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
            <Box p={3}>
              {value === 0 && <Login />}
              {value === 1 && <SignUp />}
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
