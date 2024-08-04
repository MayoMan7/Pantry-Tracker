// components/Login.js

'use client';


import { useState } from "react";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Box, TextField, Button, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Login</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleLogin} variant="contained" color="primary">
        Login
      </Button>
    </Box>
  );
};

export default Login;
