import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: 'black',
          fontWeight: 'bold',
        },
        secondary: {
          color: 'black',
          fontWeight: 'bold',
        },
      },
    },
  },
});

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        setError('Please log in to view this page');
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Log the full request details
        console.log('Making request with token:', token);
        console.log('Request headers:', {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        // Fetch user information
        const userResponse = await axios.get('http://localhost:3002/api/user/profile', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.data.status !== "SUCCESS") {
          throw new Error(userResponse.data.message || 'Error fetching user profile');
        }
        
        console.log('User profile response:', userResponse.data);
        setUserInfo(userResponse.data.data);

        // Fetch purchase history
        const purchasesResponse = await axios.get('http://localhost:3002/api/user/purchases', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (purchasesResponse.data.status !== "SUCCESS") {
          throw new Error(purchasesResponse.data.message || 'Error fetching purchase history');
        }

        console.log('Purchase history response:', purchasesResponse.data);
        setPurchases(purchasesResponse.data.data.purchases);
        setTotalSpent(purchasesResponse.data.data.totalSpent);

      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });

        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.clear();
          navigate('/');
        } else {
          setError(err.response?.data?.message || 'Error loading profile information');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button 
          onClick={() => navigate(-1)}
          variant="contained"
          sx={{ 
            mb: 3, 
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#45a049'
            }
          }}
        >
          Back
        </Button>
        <Alert severity="error" sx={{ mt: 2, color: 'black' }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 15, mb: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              backgroundColor: '#32CD32',
              boxShadow: '0 0 20px rgba(50, 205, 50, 0.5)'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Name</Typography>
                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                  {userInfo?.firstName} {userInfo?.lastName}
                </Typography>

                <Typography variant="h6">Email</Typography>
                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                  {userInfo?.email}
                </Typography>

                <Typography variant="h6">Phone</Typography>
                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                  {userInfo?.phoneNumber}
                </Typography>

                <Typography variant="h6">Username</Typography>
                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                  {userInfo?.username}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Purchase Summary
                </Typography>
                <Typography sx={{ mb: 2, fontSize: '1.5rem' }}>
                  ${totalSpent.toFixed(2)}
                </Typography>
                <Typography sx={{ mb: 3, fontSize: '1.1rem' }}>
                  Total Amount Spent
                </Typography>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Purchase History
                </Typography>
                {purchases.length > 0 ? (
                  <List>
                    {purchases.map((purchase, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`$${purchase.totalAmount?.toFixed(2) || '0.00'}`}
                          secondary={new Date(purchase.date).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ fontSize: '1.1rem' }}>
                    No purchase history available
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default PersonalInfo;
