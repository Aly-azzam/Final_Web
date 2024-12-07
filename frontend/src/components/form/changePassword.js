import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ChangePassword = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3002/api/user/change-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'SUCCESS') {
        setSuccess(response.data.message);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'black',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>
        Change Password
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="currentPassword"
          label="Current Password"
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New Password"
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#2E7D32',
              color: 'white',
              '&:hover': {
                bgcolor: '#1B5E20'
              }
            }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ChangePassword;
