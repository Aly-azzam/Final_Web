import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import ProductCard from './ProductCard';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:3002/api/solar-panel/user-solar-panels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "SUCCESS") {
        const transformedProducts = response.data.data.map(product => ({
          ...product,
          image: `http://localhost:3002/${product.image}`
        }));
        setProducts(transformedProducts);
      } else {
        console.error('Failed to fetch user products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user products:', error.response?.data);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      console.log('Deleting product:', productId);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.delete(`http://localhost:3002/api/solar-panel/solar-panels/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Delete response:', response.data);

      if (response.data.status === "SUCCESS") {
        // Remove the deleted product from the state
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setEditProduct(product);
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log('Saving edited product:', editProduct);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.put(
        `http://localhost:3002/api/solar-panel/solar-panels/${editProduct._id}`,
        {
          title: editProduct.title,
          description: editProduct.description,
          price: editProduct.price,
          location: editProduct.location,
          image: editProduct.image.replace('http://localhost:3002/', '')
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Edit response:', response.data);

      if (response.data.status === "SUCCESS") {
        // Update the products list with the edited product
        setProducts(products.map(p => 
          p._id === editProduct._id ? { ...editProduct } : p
        ));
        setEditDialog(false);
        setEditProduct(null);
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  return (
    <Container sx={{ py: 8, minHeight: '100vh', bgcolor: 'black', color: 'white' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
        My Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <ProductCard 
              product={product} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Grid>
        ))}
        {products.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              You haven't listed any products yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        PaperProps={{
          sx: { bgcolor: '#1a1a1a', color: 'white' }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                value={editProduct.title}
                onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'grey' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'grey' } }
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price"
                type="number"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'grey' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'grey' } }
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Location"
                value={editProduct.location}
                onChange={(e) => setEditProduct({ ...editProduct, location: e.target.value })}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'grey' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'grey' } }
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                multiline
                rows={4}
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'grey' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'grey' } }
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialog(false)} sx={{ color: 'grey' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProducts;
