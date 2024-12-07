import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Stack, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onDelete) {
      onDelete(product._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#1a1a1a',
      color: 'white',
      position: 'relative',
      '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 0.2s ease-in-out'
      }
    }}>
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '4px',
          padding: '4px'
        }}
      >
        <IconButton 
          size="small" 
          onClick={handleEdit}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={handleDelete}
          sx={{ 
            color: '#ff4444',
            '&:hover': {
              backgroundColor: 'rgba(255, 68, 68, 0.1)'
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'cover', bgcolor: '#2a2a2a' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'white' }}>
          {product.title}
        </Typography>
        <Typography sx={{ color: '#cccccc', mb: 1 }}>
          Price: ${product.price}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
            Location: {product.location}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
            Description: {product.description}
          </Typography>
          {product.file && (
            <Typography variant="body2" sx={{ color: '#cccccc' }}>
              File: <Link 
                href={product.file} 
                target="_blank" 
                sx={{ color: '#4fc3f7' }}
                download
              >
                Download Document
              </Link>
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
