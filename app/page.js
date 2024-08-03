'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Modal, Stack, TextField, Button, IconButton } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

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
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection="column"
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
        Inventory Tracker
      </Typography>
      <Button onClick={handleOpen} variant="contained" color="primary" sx={{ marginBottom: 2 }}>
        Add Item
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
            </IconButton>
          </Box>
          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Box width="80%" maxWidth={800} border="1px solid #ddd" borderRadius={4} p={2} bgcolor="white" boxShadow={2}>
        <Stack spacing={2}>
          {inventory.map(({ name, count }) => (
            <Box
              key={name}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#3f51b5"
              color="white"
              padding={2}
              borderRadius={2}
            >
              <Box>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="body1">Count: {count}</Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => removeItem(name)}
                  sx={{ marginRight: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => addItem(name)}
                  sx={{ marginRight: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => addItem(name)}
                >
                  Add Image
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
