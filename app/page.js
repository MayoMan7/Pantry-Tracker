'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Modal, Grid, TextField, Button, IconButton, Card, CardMedia, CardContent, CardActions, Divider } from "@mui/material";
import { firestore, storage } from "@/firebase";
import { collection, doc, getDocs, query, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await updateDoc(docRef, { count: count - 1 });
    }
    await updateInventory();
  };

  const addItem = async (item, file) => {
    let imageUrl = '';

    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await updateDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1, imageUrl });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // LocalStorage helper functions
  const getUserLikes = () => {
    const likes = localStorage.getItem('userLikes');
    return likes ? JSON.parse(likes) : {};
  };

  const setUserLikes = (likes) => {
    localStorage.setItem('userLikes', JSON.stringify(likes));
  };

  const hasUserLiked = (itemName) => {
    const userLikes = getUserLikes();
    return userLikes[itemName] || false;
  };

  const addLike = (itemName) => {
    const userLikes = getUserLikes();
    userLikes[itemName] = true;
    setUserLikes(userLikes);
  };

  const removeLike = (itemName) => {
    const userLikes = getUserLikes();
    delete userLikes[itemName];
    setUserLikes(userLikes);
  };

  const handleLike = (itemName) => {
    if (hasUserLiked(itemName)) {
      console.log('User already liked this item.');
      return;
    }

    addLike(itemName);

    // Update item count in your state
    const updatedInventory = inventory.map((item) =>
      item.name === itemName
        ? { ...item, count: item.count + 1 }
        : item
    );
    setInventory(updatedInventory);
  };

  const handleDislike = (itemName) => {
    if (!hasUserLiked(itemName)) {
      console.log('User has not liked this item.');
      return;
    }

    removeLike(itemName);

    // Update item count in your state
    const updatedInventory = inventory.map((item) =>
      item.name === itemName
        ? { ...item, count: item.count - 1 }
        : item
    );
    setInventory(updatedInventory);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f5f5f5', overflowY: 'auto' }} // Enable scrolling
    >
      <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
        SnapShare
      </Typography>
      <Button onClick={handleOpen} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
        Add a Post
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Item</Typography>
            <IconButton onClick={handleClose} size="small">
              {/* Close Icon */}
            </IconButton>
          </Box>
          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              addItem(itemName, selectedFile);
              setItemName('');
              setSelectedFile(null);
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Box width="90%" maxWidth={1200} border="1px solid #ddd" borderRadius={4} p={2} bgcolor="white" boxShadow={2} overflow="auto">
        <Grid container spacing={2}>
          {inventory.map(({ name, count, imageUrl }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card sx={{ height: '100%' }}>
                {imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={name}
                    sx={{ objectFit: 'cover' }} // Ensure images cover the space without distortion
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
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDislike(name);
                    }}
                    disabled={!hasUserLiked(name)}
                  >
                    Dislike
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(name);
                    }}
                    disabled={hasUserLiked(name)}
                  >
                    Like
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={800}
          height={600}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          {selectedItem && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedItem.name}
              </Typography>
              {selectedItem.imageUrl && (
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  width={800}
                  height={600}
                  layout="intrinsic"
                  quality={100}
                />
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
