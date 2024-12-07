import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import { Typography, useMediaQuery, useTheme, Link } from "@mui/material";
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Signup from '../form/signup';
import Signin from '../form/signin';
import Sell from '../sell/sell';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import scrollToTop from '../scrollUtils';
import logo from '../../images/logo.png';
import ChangePassword from '../form/changePassword';
import DrawerComp from "./drawer";

const pages = ['Home', 'About Us', 'Solar Panels', 'Sell', 'Your Plantations'];

function Header({ onSearchResultsChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isSeller, setIsSeller] = React.useState(false);

  useEffect(() => {
    // Check authentication status when component mounts or when token changes
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:3002/api/auth/check-token', null, {
            headers: {
              Authorization: `bearer ${token}`,
            }
          });

          if (response.data.valid) {
            setIsAuthenticated(true);
            const roles = response.data.data.roles;
            setIsSeller(roles.includes('seller'));
          } else {
            setIsAuthenticated(false);
            setIsSeller(false);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error checking token validity:', error);
          setIsAuthenticated(false);
          setIsSeller(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
        setIsSeller(false);
      }
    };

    checkAuth();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("1150")); //1071 1186

  const isMatchSearch = useMediaQuery(theme.breakpoints.down("1295"));
  const isMatchSearch1 = useMediaQuery(theme.breakpoints.down("1190"));

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const btnstyle = {
    backgroundColor: 'black',
    color: 'white',
    fontWeight: '900',
    fontSize: '16px',
    width: '50%',  // Adjust the width as needed
    borderRadius: '150px',
    margin: '20px auto',
    textTransform: 'none',
  };

  const linkstyle = { color: 'black', textDecorationColor: 'black' }

  const handleLogin = (status) => {
    if (status) {
      setIsAuthenticated(true);
      const rolesFromStorage = JSON.parse(localStorage.getItem("roles") || "[]");
      setIsSeller(rolesFromStorage.includes('seller'));
      window.location.reload(); // Refresh to update the UI
    } else {
      setIsAuthenticated(false);
      setIsSeller(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    setIsAuthenticated(false);
    setIsSeller(false);
    handleClose();
    window.location.reload(); // Refresh to update the UI
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/solar-panel/search-solar-panels?q=${searchQuery}`);
      // Update state with search results
      onSearchResultsChange(response.data.data);
    } catch (error) {
      console.error('Error searching solar panels:', error.response?.data);
    }
  };

  const handleSearchAll = async () => {
    try {
      if (!isAuthenticated) {
        setIsLoginDialogOpen(true);
        return;
      }
      const response = await axios.get(`http://localhost:3001/solar-panel/solar-panels`);
      // Update state with search results
      onSearchResultsChange(response.data.data);
    } catch (error) {
      console.error('Error searching solar panels:', error.response?.data);
    }
  };

  const handleMyProducts = async () => {
    setAnchorEl(null);
    navigate('/my-products');
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  const openDialog = (type) => {
    setIsDialogOpen(true);
    setDialogType(type);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogType(null);
  };

  return (
    <React.Fragment>
        <AppBar position="fixed" sx={{ backgroundColor: '#181818', boxShadow: 'none' }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <IconButton 
                onClick={() => { navigate('/'); scrollToTop(); }}
                sx={{ p: 0, marginRight: '10px' }}
            >
                <Avatar alt="Logo" src={logo} sx={{ width: 56, height: 56 }} />
            </IconButton>

            {isMatch ? (
              <>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    label={searchQuery ? '' : 'Search'}
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {searchQuery && (
                            <IconButton
                              onClick={() => setSearchQuery('')}
                              edge="end"
                              sx={{ color: 'white' }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={handleSearch}
                            edge="end"
                            sx={{ color: 'white' }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: {
                        color: 'white',
                        borderColor: 'white',
                      },
                    }}
                    sx={{
                      width: isMatchSearch ? '100%' : isMatchSearch1 ? '350px' : '500px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                      },
                    }}
                    onFocus={(e) => e.preventDefault()} // Prevent focus on click
                  />
                </Box>
                <DrawerComp isAuthenticated={isAuthenticated} openDialog={openDialog} onYourPlantations={handleMyProducts} solarPanels={handleSearchAll} handleLogout={handleLogout}/>
              </>
            ) : (
              <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        sx={{ mx: 2, color: 'white', fontSize: '1.1rem' }}
                        onClick={() => { navigate('/'); scrollToTop(); }}
                    >
                        Home
                    </Button>
                    <Button
                        sx={{ mx: 2, color: 'white', fontSize: '1.1rem' }}
                        onClick={() => { navigate('/about-us'); scrollToTop(); }}
                    >
                        About Us
                    </Button>
                    <Button
                        sx={{ mx: 2, color: 'white', fontSize: '1.1rem' }}
                        onClick={() => {
                          if (!isAuthenticated) {
                            setIsLoginDialogOpen(true);
                            return;
                          }
                          handleSearchAll();
                          if (isSeller) {
                            navigate("/sell");
                          } else {
                            navigate("/buy");
                          }
                        }}
                    >
                        Shop
                    </Button>
                    
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label={searchQuery ? '' : 'Search'}
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchQuery && (
                          <IconButton
                            onClick={() => setSearchQuery('')}
                            edge="end"
                            sx={{ color: 'white' }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={handleSearch}
                          edge="end"
                          sx={{ color: 'white' }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                      borderColor: 'white',
                    },
                  }}
                  sx={{
                    width: isMatchSearch ? '100%' : isMatchSearch1 ? '350px' : '500px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    },
                  }}
                  onFocus={(e) => e.preventDefault()} // Prevent focus on click
                />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                {isAuthenticated ? (
                <div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle fontSize='large'/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            bgcolor: 'black',
                            color: 'white',
                        }
                    }}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        navigate('/personal-info');
                    }} sx={{ color: 'white' }}>Personal Information</MenuItem>
                  
                    <MenuItem onClick={() => {
                        handleClose();
                        navigate('/buy');
                    }} sx={{ color: 'white' }}>Store</MenuItem>
                    
                    {isSeller && (
                      <>
                        <MenuItem onClick={handleMyProducts} sx={{ color: 'white' }}>My Products</MenuItem>
                        <MenuItem onClick={() => {
                          handleClose();
                          navigate('/sell');
                        }} sx={{ color: 'white' }}>Sell</MenuItem>
                      </>
                    )}
                  
                    <MenuItem onClick={() => {
                        handleClose();
                        setOpenChangePassword(true);
                    }} sx={{ color: 'white' }}>Change Password</MenuItem>
                  
                    <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>Logout</MenuItem>
                </Menu>
                </div>
                ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={() => openDialog('signin')}
                        sx={{
                          my: 2,
                          color: 'white',
                          display: 'block',
                          marginRight: '10px'
                        }}
                    >
                      Sign in
                    </Button>
                    <Button
                        onClick={() => openDialog('signup')}
                        sx={{
                          my: 2,
                          color: 'white',
                          display: 'block'
                        }}
                    >
                      Sign up
                    </Button>
                </Box>
                )}
            </Box>
            </>
          )}
        </Toolbar>
        </Container>
    </AppBar>

    <Dialog 
        open={isDialogOpen} 
        onClose={closeDialog}
        PaperProps={{
            style: {
                backgroundColor: 'white',
                boxShadow: 'none',
                width: '500px'
            },
        }}
    >
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: 'black' }}>
                    {dialogType === 'signup' ? 'Create Account' : dialogType === 'signin' ? 'Welcome Back!' : 'Sell Product'}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={closeDialog}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent>
            {dialogType === 'signup' && <Signup onClose={closeDialog} openDialog={openDialog} />}
            {dialogType === 'signin' && <Signin onClose={closeDialog} openDialog={openDialog} onLogin={handleLogin} />}
            {dialogType === 'sell' && <Sell onClose={closeDialog} />}
        </DialogContent>
    </Dialog>

    <Dialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        PaperProps={{
            style: {
                backgroundColor: 'white',
                boxShadow: 'none',
                width: '500px'
            },
        }}
    >
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: 'black' }}>
                    Change Password
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => setOpenChangePassword(false)}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent>
            <ChangePassword 
                open={openChangePassword} 
                onClose={() => setOpenChangePassword(false)} 
            />
        </DialogContent>
    </Dialog>

    <Dialog
        open={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        PaperProps={{
            style: {
                backgroundColor: 'white',
                boxShadow: 'none',
                width: '500px'
            },
        }}
    >
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', color: 'black' }}>
                    Please Sign In
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => setIsLoginDialogOpen(false)}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent>
            <Typography variant="body1" style={{ marginBottom: '20px', color: 'black' }}>
                You need to be signed in to access this feature.
            </Typography>
            <Box display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    style={btnstyle}
                    onClick={() => {
                        setIsLoginDialogOpen(false);
                        openDialog('signin');
                    }}
                >
                    Sign In
                </Button>
            </Box>
            <Box textAlign="center" style={{ marginTop: '10px' }}>
                <Typography variant="body2" style={{ color: 'black' }}>
                    Don't have an account?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            setIsLoginDialogOpen(false);
                            openDialog('signup');
                        }}
                        style={linkstyle}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </DialogContent>
    </Dialog>
    </React.Fragment>
  );
}

export default Header;
