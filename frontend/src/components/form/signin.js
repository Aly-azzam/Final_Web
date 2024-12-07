import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Link, InputAdornment, IconButton, Divider, Dialog, Box, Stack } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Header from '../header/header';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleButton = ({ onClose }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login success:', tokenResponse);
        
        // Get user info from Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        console.log('Google user info:', userInfo.data);

        // Send to backend
        const backendResponse = await axios.post('http://localhost:3002/api/auth/google', {
          token: tokenResponse.id_token,
          userInfo: userInfo.data
        });
        console.log('Backend response:', backendResponse.data);

        if (backendResponse.data.status === 'SUCCESS') {
          localStorage.setItem('token', backendResponse.data.accessToken);
          localStorage.setItem('userId', backendResponse.data.data[0]._id);
          localStorage.setItem('roles', JSON.stringify(backendResponse.data.data[0].roles));
          alert('Login successful!');
          onClose();
          window.location.reload();
        } else {
          console.error('Login failed:', backendResponse.data);
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Google sign in error:', error.response?.data || error.message);
        alert('Google sign in failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert('Google sign in failed. Please try again.');
    },
    flow: 'implicit'
  });

  return (
    <Button
      onClick={() => login()}
      variant="outlined"
      fullWidth
      style={{
        backgroundColor: 'black',
        color: 'white',
        border: '1px solid #39FF14',
        borderRadius: '4px',
        padding: '10px',
        textTransform: 'none',
        marginTop: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '13px',
        boxShadow: '0 0 10px #39FF14',
        width: '90%',
        margin: '10px auto 20px'
      }}
    >
      <img src={require('../../images/googleLogo.png')} alt="Google" style={{ width: '50px', height: '50px' }} />
      Continue with Google
    </Button>
  );
};

function Login({ onClose, openDialog, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const paperStyle = {
        padding: '20px',
        width: '80%',
        maxWidth: '400px',
        backgroundColor: 'black',
        borderRadius: '10px',
        boxShadow: '0 0 20px #39FF14'
    };

    const btnstyle = {
        backgroundColor: '#39FF14',
        color: 'black',
        fontWeight: '900',
        fontSize: '16px',
        width: '70%',
        borderRadius: '150px',
        margin: '20px auto',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#32FF14'
        }
    };

    const titleStyle = {
        marginBottom: '20px',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 0 7px #39FF14, 0 0 10px #39FF14, 0 0 21px #39FF14',
    };

    const inputLabelStyle = {
        color: 'white !important',
        textShadow: '0 0 7px #39FF14, 0 0 10px #39FF14',
    };

    const textFieldStyle = {
        '& .MuiInputBase-input': { 
            color: 'white !important',
            textShadow: '0 0 5px #39FF14',
            backgroundColor: 'black'
        },
        '& .MuiInputLabel-root': { 
            color: 'white !important',
            textShadow: '0 0 7px #39FF14',
            backgroundColor: 'black'
        },
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'black',
            '& fieldset': { 
                borderColor: '#39FF14 !important',
                boxShadow: '0 0 5px #39FF14'
            },
            '&:hover fieldset': { 
                borderColor: '#39FF14 !important',
                boxShadow: '0 0 10px #39FF14'
            },
            '&.Mui-focused fieldset': { 
                borderColor: '#39FF14 !important',
                boxShadow: '0 0 15px #39FF14'
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleLogin = () => {
        setLoginMessage('');
        axios.post('http://localhost:3002/api/auth/login', { 
            email: username, 
            password 
        })
        .then((response) => {
            console.log('Login response:', response.data);
            if (response.data.status === 'SUCCESS') {
                const token = response.data.accessToken;
                console.log('Login successful. Token:', token);
        
                localStorage.setItem("token", token);
                const userData = response.data.data[0];
                localStorage.setItem("userId", userData._id);
                localStorage.setItem("roles", JSON.stringify(userData.roles));
                
                alert('Login successful!');
                onClose();
                onLogin(true);
            } else {
                console.error('Login failed:', response.data.message);
                setLoginMessage(response.data.message || 'Login failed');
            }
        })
        .catch((error) => {
            console.error('Login error:', error.response?.data || error);
            setLoginMessage(error.response?.data?.message || 'Login failed. Please try again.');
        });
    };

    const closeButtonStyle = {
        position: 'absolute',
        right: '10px',
        top: '10px',
        color: '#39FF14',
        backgroundColor: 'black',
        border: '2px solid #39FF14',
        boxShadow: '0 0 10px #39FF14',
        animation: 'neonPulse 1.5s infinite',
        padding: '5px',
        minWidth: '35px',
        minHeight: '35px',
        '&:hover': {
            backgroundColor: 'black',
            boxShadow: '0 0 20px #39FF14',
        }
    };

    return (
        <Dialog 
            open={true} 
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }
            }}
            hideBackdrop={false}
            disableEscapeKeyDown={false}
            fullWidth
            maxWidth="sm"
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ 
                    backgroundColor: 'black',
                    padding: '20px',
                    position: 'relative'
                }}
            >
                <Paper elevation={0} style={paperStyle}>
                    <IconButton
                        onClick={onClose}
                        style={closeButtonStyle}
                    >
                        <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px #39FF14',
                            lineHeight: '1'
                        }}>×</span>
                    </IconButton>
                    <style>
                        {`
                            @keyframes neonPulse {
                                0% { box-shadow: 0 0 5px #39FF14; }
                                50% { box-shadow: 0 0 20px #39FF14; }
                                100% { box-shadow: 0 0 5px #39FF14; }
                            }
                        `}
                    </style>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <h2 style={titleStyle}>Sign In</h2>
                        </Grid>

                        <GoogleButton onClose={onClose} />
                        
                        <Divider style={{ margin: '20px 0' }}>
                            <Typography style={{ 
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0 0 7px #39FF14, 0 0 10px #39FF14'
                            }}>or</Typography>
                        </Divider>

                        <Stack spacing={2} direction={'column'}>
                            <TextField
                                label='Username or Email'
                                placeholder='Enter Username or Email'
                                variant="outlined"
                                fullWidth
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    style: { color: 'white' }
                                }}
                            />
                            <TextField
                                label='Password'
                                placeholder='Enter Password'
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    style: { color: 'white' },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                                style={{ color: 'white' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Stack>

                        {loginMessage && (
                            <Typography 
                                align="center" 
                                style={{ 
                                    marginTop: '10px',
                                    color: 'white',
                                    textShadow: '0 0 7px #39FF14'
                                }}
                            >
                                {loginMessage}
                            </Typography>
                        )}

                        <Grid container justifyContent="center">
                            <Button 
                                type='submit' 
                                variant="contained" 
                                onClick={handleLogin}
                                style={{
                                    ...btnstyle,
                                    boxShadow: '0 0 10px #39FF14'
                                }}
                            >
                                Sign in
                            </Button>
                        </Grid>

                        <Typography 
                            align="center" 
                            style={{ 
                                marginTop: '10px',
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0 0 7px #39FF14'
                            }}
                        >
                            Don't have an account?{' '}
                            <Link
                                href="#"
                                onClick={() => {
                                    onClose();
                                    openDialog('signup');
                                }}
                                style={{ 
                                    color: 'white',
                                    textDecorationColor: 'white',
                                    fontWeight: 'bold',
                                    textShadow: '0 0 7px #39FF14'
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Dialog>
    );
}

export default Login;
