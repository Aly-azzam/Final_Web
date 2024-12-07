import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Container,
  Box,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Buy = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');

  // Sample products in case no products are fetched
  const sampleProducts = [
    {
      _id: '1',
      title: 'Premium Solar Panel',
      description: 'High-efficiency solar panel with 20-year warranty',
      price: 599.99,
      image: '/path/to/sample/image1.jpg',
      location: 'Baabda'
    },
    {
      _id: '2',
      title: 'Solar Panel Kit',
      description: 'Complete solar panel kit with installation materials',
      price: 899.99,
      image: '/path/to/sample/image2.jpg',
      location: 'Hazmieh'
    },
    {
      _id: '3',
      title: 'Eco Solar Panel',
      description: 'Environmentally friendly solar panel with advanced technology',
      price: 749.99,
      image: '/path/to/sample/image3.jpg',
      location: 'Mansourieh'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/solar-panel/solar-panels/first-10');
      if (response.data.status === "SUCCESS" && response.data.data.length > 0) {
        const transformedProducts = response.data.data.map(panel => ({
          _id: panel._id,
          title: panel.title,
          description: panel.description,
          price: panel.price,
          image: `http://localhost:3002/${panel.image}`,
          location: panel.location
        }));
        setProducts(transformedProducts);
      } else {
        // Use sample products if no products are fetched
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use sample products in case of error
      setProducts(sampleProducts);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = () => {
    // Handle payment submission based on method
    switch(paymentMethod) {
      case 'whatsapp':
        window.open('https://wa.me/96170654802', '_blank');
        break;
      case 'card':
        // Handle card payment
        console.log('Processing card payment...');
        break;
      case 'cash':
        // Handle cash on delivery
        console.log('Processing cash on delivery...');
        break;
      default:
        console.log('Please select a payment method');
    }
    setOpenPaymentForm(false);
  };

  const handleCheckout = () => {
    setOpenPaymentForm(true);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #000000 30%, #1a472a 90%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 2 }}>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: 'darkgreen',
              }
            }}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
        </Box>
        {/* Shopping Cart Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton 
            onClick={() => setOpenCart(true)}
            sx={{ 
              backgroundColor: '#2e7d32',
              color: 'white',
              '&:hover': { backgroundColor: '#1b5e20' }
            }}
          >
            <ShoppingCartIcon />
            {cart.length > 0 && (
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  top: -8, 
                  right: -8, 
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '4px 8px'
                }}
              >
                {cart.length}
              </Typography>
            )}
          </IconButton>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: '#ffffff',
                  '&:hover': { 
                    transform: 'scale(1.02)', 
                    transition: 'transform 0.2s',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, '& > *': { color: 'black !important', fontWeight: 'bold !important' } }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.title}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Location: {product.location}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => addToCart(product)}
                    sx={{ 
                      backgroundColor: '#2e7d32',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#1b5e20' }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Shopping Cart Dialog */}
        <Dialog 
          open={openCart} 
          onClose={() => setOpenCart(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: '#ffffff'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: 'black !important',
            fontWeight: 'bold !important'
          }}>
            Shopping Cart
          </DialogTitle>
          <DialogContent sx={{ '& .MuiTypography-root': { color: 'black !important', fontWeight: 'bold !important' } }}>
            {cart.length === 0 ? (
              <Typography>
                Your cart is empty
              </Typography>
            ) : (
              <Box>
                {cart.map((item) => (
                  <Paper 
                    key={item._id} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">
                        Quantity: {item.quantity} x ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => removeFromCart(item._id)}
                      sx={{ 
                        color: 'black !important',
                        '& .MuiSvgIcon-root': {
                          color: 'black !important'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
                <Typography variant="h6">
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenCart(false)}
              sx={{ 
                backgroundColor: '#2e7d32',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1b5e20'
                }
              }}
            >
              Close
            </Button>
            {cart.length > 0 && (
              <Button 
                variant="contained" 
                onClick={handleCheckout}
                sx={{ 
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#115293'
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Payment Form Dialog */}
        <Dialog 
          open={openPaymentForm} 
          onClose={() => setOpenPaymentForm(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: 'black'
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 'bold' }}>
            Payment Method
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
              {/* Payment Method Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant={paymentMethod === 'whatsapp' ? 'contained' : 'outlined'}
                  onClick={() => handlePaymentMethodChange('whatsapp')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&.Mui-selected': { backgroundColor: '#2e7d32' }
                  }}
                >
                  Whish Money
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                  onClick={() => handlePaymentMethodChange('card')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&.Mui-selected': { backgroundColor: '#2e7d32' }
                  }}
                >
                  Visa Card
                </Button>
                <Button
                  variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                  onClick={() => handlePaymentMethodChange('cash')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&.Mui-selected': { backgroundColor: '#2e7d32' }
                  }}
                >
                  Cash on Delivery
                </Button>
              </Box>

              {/* Form Fields based on payment method */}
              {paymentMethod === 'card' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    fullWidth
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Expiry Date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      sx={{ 
                        flex: 1,
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-root': { 
                          color: 'white',
                          '& fieldset': { borderColor: 'white' },
                          '&:hover fieldset': { borderColor: 'white' },
                        }
                      }}
                    />
                    <TextField
                      label="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      sx={{ 
                        flex: 1,
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-root': { 
                          color: 'white',
                          '& fieldset': { borderColor: 'white' },
                          '&:hover fieldset': { borderColor: 'white' },
                        }
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Delivery Address for all methods */}
              <TextField
                label="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': { 
                    color: 'white',
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                  }
                }}
              />

              {paymentMethod === 'whatsapp' && (
                <Typography sx={{ color: 'white', textAlign: 'center' }}>
                  WhatsApp Money Number: +961 70 654 802
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenPaymentForm(false)}
              sx={{ color: 'white' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handlePaymentSubmit}
              disabled={!paymentMethod || (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv)) || !address}
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': { backgroundColor: '#1b5e20' },
                '&.Mui-disabled': { backgroundColor: '#1b5e20', opacity: 0.7 }
              }}
            >
              Confirm Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Buy;
