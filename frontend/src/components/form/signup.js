import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography, Link, InputAdornment, IconButton, Divider } from "@mui/material";
import { Box, Stack } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleButton = ({ onClick, onClose }) => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        });

        // Send to our backend for registration
        const backendResponse = await axios.post('http://localhost:3002/api/auth/google', {
          token: response.id_token,
          userInfo: userInfo.data
        });

        if (backendResponse.data.status === 'SUCCESS') {
          const token = backendResponse.data.accessToken;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", backendResponse.data.data[0]._id);
          localStorage.setItem("roles", JSON.stringify(backendResponse.data.data[0].roles));
          alert('Registration successful!');
          onClose();
          window.location.reload();
        }
      } catch (error) {
        console.error('Google sign up failed:', error);
        alert('Google sign up failed. Please try again.');
      }
    },
    onError: () => {
      console.error('Google Sign Up Failed');
      alert('Google sign up failed. Please try again.');
    }
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

function SignUp({ onClose, openDialog, openedFromLeafletMap }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [roleErrorMessage, setRoleErrorMessage] = useState('');

  const [selectedRole, setSelectedRole] = useState(null);
  const [date, setDate] = React.useState(dayjs().startOf('day'));
  const [location, setLocation] = React.useState(null); //''

  // const handleChange = (event) => {
  //   setLocation(event.target.value);
  // };
  const handleChange = (event, newValue) => {
    setLocation(newValue);
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
    textTransform: 'none'
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

  const validateForm = () => {
    let isValid = true;
    if (firstName.length < 2) {
      setFirstNameError('First name should have at least 2 characters.');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (lastName.length < 2) {
      setLastNameError('Last name should have at least 2 characters.');
      isValid = false;
    } else {
      setLastNameError('');
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    } else {
      setEmailError('');
    }

    const phoneRegex = /^(03|70|71|76|80|81)\d{6}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('Invalid lebanese phone number.');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    if (username.length < 3) {
      setUsernameError('Username should have at least 3 characters.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password should be at least 8 characters with one uppercase letter, one lowercase letter, one digit, and one special character.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!selectedRole) {
      setRoleErrorMessage('Please select a role.');
      isValid = false;
    } else {
      setRoleErrorMessage('');
    }

    return isValid;
  };

  const handleClearErrorMessage = () => {
    setErrorMessage('');
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClearErrorMessage();
    
    if (validateForm()) {
      const formData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password: password,
        dateOfBirth: date,
        location: location,
        roleChoice: selectedRole,
      };

      axios
        .post('http://localhost:3002/api/auth/signup', formData)
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            alert('Account created successfully!');
            onClose();
            if (!openedFromLeafletMap) {
              openDialog('signin');
            }
          } else {
            setErrorMessage(response.data.message || 'Signup failed. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Signup failed:', error);
          setErrorMessage(
            error.response?.data?.message || 
            'An error occurred during signup. Please try again.'
          );
        });
    }
  }; 

  const handleGoogleSignUp = async () => {
    try {
      // Implement Google OAuth logic here
      console.log('Google sign up clicked');
    } catch (error) {
      console.error('Google sign up failed:', error);
      setErrorMessage('Google sign up failed. Please try again.');
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
          <form onSubmit={handleSubmit}>
            <Grid container alignItems='center' justifyContent='center'>
              <h2 style={{ 
                marginBottom: '20px', 
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 0 7px #39FF14, 0 0 10px #39FF14, 0 0 21px #39FF14'
              }}>Sign Up</h2>
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
              <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  label='First Name'
                  placeholder='Enter first name'
                  variant="outlined"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!firstNameError}
                  helperText={firstNameError}
                  sx={textFieldStyle}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
                <TextField
                  label='Last Name'
                  placeholder='Enter last name'
                  variant="outlined"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!lastNameError}
                  helperText={lastNameError}
                  sx={textFieldStyle}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
              </Stack>

              <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }}>
                <Autocomplete
                  options={cities}
                  fullWidth
                  value={location}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      variant="outlined"
                      required
                      sx={{
                        ...textFieldStyle,
                        width: '100%'
                      }}
                    />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    variant="outlined"
                    placeholder='Date of Birth'
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    fullWidth
                    required
                    sx={{
                      ...textFieldStyle,
                      '& .MuiCalendarPicker-root': {
                        backgroundColor: 'black',
                      },
                      '& .MuiPaper-root': {
                        backgroundColor: 'black',
                      },
                      '& .MuiPickersDay-root': {
                        backgroundColor: 'black',
                        color: '#39FF14',
                        '&:hover': {
                          backgroundColor: '#39FF14',
                          color: 'black',
                        },
                      },
                      '& .MuiPickersDay-today': {
                        borderColor: '#39FF14',
                      },
                      '& .MuiPickersDay-selected': {
                        backgroundColor: '#39FF14',
                        color: 'black',
                      },
                      '& .MuiDayPicker-weekDayLabel': {
                        color: '#39FF14',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#39FF14',
                      },
                      '& .MuiPickersArrowSwitcher-button': {
                        color: '#39FF14',
                      },
                      '& .MuiYearCalendar-root': {
                        backgroundColor: 'black',
                      },
                      '& .MuiPickersYear-yearButton': {
                        color: '#39FF14',
                      },
                      '& .MuiPickersYear-yearButton.Mui-selected': {
                        backgroundColor: '#39FF14',
                        color: 'black',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Stack>

              <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  label='Email'
                  placeholder='Enter email'
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  sx={textFieldStyle}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
                <TextField
                  label='Phone Number'
                  placeholder='Enter phone number'
                  variant="outlined"
                  fullWidth
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={!!phoneNumberError}
                  helperText={phoneNumberError}
                  sx={textFieldStyle}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
              </Stack>

              <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  label='Username'
                  placeholder='Enter username'
                  variant="outlined"
                  fullWidth
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!usernameError}
                  helperText={usernameError}
                  sx={textFieldStyle}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
                <TextField 
                  label='Password' 
                  placeholder='Enter password' 
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined" 
                  fullWidth 
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  error={!!passwordError} 
                  helperText={passwordError}
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

              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: 'white', textShadow: '0 0 7px #39FF14' }}>Role</FormLabel>
                <RadioGroup
                  row
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <FormControlLabel 
                    value="Buyer" 
                    control={<Radio style={{ color: '#39FF14' }} />} 
                    label={<span style={{ color: 'white', textShadow: '0 0 7px #39FF14' }}>Buyer</span>} 
                  />
                  <FormControlLabel 
                    value="buyAndSell" 
                    control={<Radio style={{ color: '#39FF14' }} />} 
                    label={<span style={{ color: 'white', textShadow: '0 0 7px #39FF14' }}>Seller</span>} 
                  />
                </RadioGroup>
              </FormControl>

              {roleErrorMessage && !errorMessage &&(
              <Typography style={{ color: 'red', textAlign: 'center' }}>
                {roleErrorMessage}
              </Typography>
            )}
              {errorMessage && !roleErrorMessage && (
                <Typography 
                  align="center" 
                  style={{ 
                    marginTop: '10px',
                    color: 'white',
                    textShadow: '0 0 7px #39FF14'
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Grid container justifyContent="center">
                <Button 
                  type='submit' 
                  variant="contained" 
                  onClick={handleSubmit}
                  style={{
                    ...btnstyle,
                    boxShadow: '0 0 10px #39FF14'
                  }}
                >
                  Sign up
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
                Already have an account?{' '}
                <Link
                  href="#"
                  onClick={() => {
                    onClose();
                    openDialog('signin');
                  }}
                  style={{ 
                    color: 'white',
                    textDecorationColor: 'white',
                    fontWeight: 'bold',
                    textShadow: '0 0 7px #39FF14'
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default SignUp;