// src/pages/index.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const HomePage = () => {
  const [itemName, setItemName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemName.trim() === '') {
      alert('Item name cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'pantryItems'), {
        name: itemName,
        createdAt: new Date(),
      });
      setItemName('');
      alert('Item added successfully');
    } catch (error) {
      console.error('Error adding item: ', error);
      alert('Error adding item');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
          Pantry Tracker
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Add Item
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default HomePage;
