// components/Logout.js

'use client';

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";

const Logout = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="secondary">
      Logout
    </Button>
  );
};

export default Logout;
