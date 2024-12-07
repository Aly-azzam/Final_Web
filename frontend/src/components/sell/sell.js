import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";
import { Box, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

function Sell({ onClose, openDialog }) {
  const [title, settitle] = useState('');
  const [price, setprice] = useState('');
  const [description, setdescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');

  const [titleError, settitleError] = useState('');
  const [descriptionError, setdescriptionError] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event, newValue) => {
    setLocation(newValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const cities = [
    'Baabda',
    'Boutchay',
    'Hazmieh',
    'Mansourieh',
    'Bsalim'
  ];

  const paperStyle = {
    padding: '20px',
    width: '60%',
    maxWidth: '300px',
    backgroundColor: 'black',
    color: 'white'
  };

  const btnstyle = {
    backgroundColor: '#57c1ff',
    color: 'white',
    fontWeight: '900',
    fontSize: '16px',
    width: '70%',
    borderRadius: '150px',
    margin: '20px auto',
    textTransform: 'none',
  };

  const validateForm = () => {
    let isValid = true;
    if (title.length < 2) {
      settitleError('Title should have at least 2 characters.');
      isValid = false;
    } else {
      settitleError('');
    }

    if (description.length < 3 || description.length > 200) {
      setdescriptionError('Descripton should be 200 characters maximum.');
      isValid = false;
    } else {
      setdescriptionError('');
    }

    return isValid;
  };

  const handleClearErrorMessage = () => {
    setErrorMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const authToken = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('location', location);
      formData.append('image', image);

      axios
        .post('http://localhost:3002/api/solar-panel/solar-panels', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`
          }
        })
        .then((response) => {
          console.log('Response:', response.data);
          if (response.data.status === 'SUCCESS') {
            alert('Solar panel ad posted successfully!');

            onClose();
          } else if (response.data.status === 'FAILED') {
            console.error('Sell failed:', response.data.message);
            setErrorMessage(response.data.message);
          } else {
            console.error('Sell failed: Unexpected response format');
            setErrorMessage('Unexpected response format.');
          }
        })
        .catch((error) => {
          console.error('Sell failed:', error.response?.data);

          setErrorMessage(error.response?.data.message);
        });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ 
        backgroundColor: 'black', 
        pt: 15, 
        pb: 4,
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <Paper elevation={0} style={paperStyle}>
        <form onSubmit={handleSubmit}>
          <Grid container alignItems='center' justifyContent='center'>
            <Typography variant="h5" sx={{
              marginBottom: '20px',
              color: 'white !important',
              fontWeight: 'bold'
            }}>
              List your product
            </Typography>
          </Grid>
          <Stack spacing={1} direction={'column'}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField 
                label='Title' 
                variant="outlined" 
                placeholder='Enter Title' 
                fullWidth 
                required 
                value={title} 
                onChange={(e) => settitle(e.target.value)} 
                error={!!titleError} 
                helperText={titleError}
                size="small"
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '& input': { color: 'white' }
                  },
                  '& .MuiFormHelperText-root': { color: 'red' }
                }}
              />
              <TextField 
                label='Price' 
                variant="outlined" 
                placeholder='Enter Price' 
                type='number' 
                fullWidth 
                required
                value={price} 
                onChange={(e) => setprice(e.target.value)}
                size="small"
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '& input': { color: 'white' }
                  }
                }}
              />
            </Stack>
            <TextField 
              label='Description' 
              variant="outlined" 
              placeholder='Enter Description' 
              multiline 
              rows={2}
              fullWidth 
              required
              value={description} 
              onChange={(e) => setdescription(e.target.value)}
              error={!!descriptionError} 
              helperText={descriptionError}
              size="small"
              sx={{ 
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '& textarea': { color: 'white' }
                },
                '& .MuiFormHelperText-root': { color: 'red' }
              }}
            />
            <Autocomplete
              value={location}
              onChange={handleChange}
              options={cities}
              size="small"
              PaperComponent={({ children }) => (
                <Paper 
                  style={{ 
                    backgroundColor: 'black',
                    color: 'white'
                  }}
                >
                  {children}
                </Paper>
              )}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  label="Location" 
                  variant="outlined"
                  required
                  size="small"
                  sx={{ 
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '& input': { color: 'white' }
                    }
                  }}
                />
              }
              sx={{
                '& .MuiAutocomplete-popupIndicator': { color: 'white' },
                '& .MuiAutocomplete-clearIndicator': { color: 'white' },
                '& .MuiAutocomplete-option': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#333333'
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: '#404040'
                  }
                }
              }}
            />
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ color: 'white', marginTop: '4px', marginBottom: '4px' }}
            />
            <Button 
              type='submit' 
              style={btnstyle} 
              variant="contained"
              size="small"
            >
              Submit
            </Button>
          </Stack>
          {errorMessage && (
            <Typography style={{ color: 'white', textAlign: 'center' }}>
              {errorMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default Sell;