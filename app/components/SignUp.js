// pages/signup.js
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/firebase'; // Import your Firebase authentication and Firestore instances
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add username and other user details to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        email,
        // Add other user data here
      });

      router.push('/login'); // Redirect to login page after successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Sign Up</Button>
      </form>
    </Box>
  );
}
