import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const DrawerComp = ({ isAuthenticated, openDialog, onYourPlantations, solarPanels, handleLogout }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    const handleClick = (action) => {
        setOpenDrawer(false);
        action();
    };

    return (
        <React.Fragment>
            <Drawer 
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                }}
            >
                <List>
                    <ListItemButton onClick={() => handleClick(() => navigate('/'))}>
                        <ListItemIcon>
                            <HomeIcon sx={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleClick(() => navigate('/about-us'))}>
                        <ListItemIcon>
                            <InfoIcon sx={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText primary="About Us" />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleClick(solarPanels)}>
                        <ListItemIcon>
                            <ShoppingCartIcon sx={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText primary="Solar Panels" />
                    </ListItemButton>

                    {isAuthenticated ? (
                        <>
                            <ListItemButton onClick={() => handleClick(onYourPlantations)}>
                                <ListItemIcon>
                                    <ShoppingCartIcon sx={{ color: 'white' }}/>
                                </ListItemIcon>
                                <ListItemText primary="Your Plantations" />
                            </ListItemButton>

                            <ListItemButton onClick={() => handleClick(handleLogout)}>
                                <ListItemIcon>
                                    <LogoutIcon sx={{ color: 'white' }}/>
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </>
                    ) : (
                        <>
                            <ListItemButton onClick={() => handleClick(() => openDialog('signin'))}>
                                <ListItemIcon>
                                    <LoginIcon sx={{ color: 'white' }}/>
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>

                            <ListItemButton onClick={() => handleClick(() => openDialog('signup'))}>
                                <ListItemIcon>
                                    <PersonAddIcon sx={{ color: 'white' }}/>
                                </ListItemIcon>
                                <ListItemText primary="Signup" />
                            </ListItemButton>
                        </>
                    )}
                </List>
            </Drawer>
            <IconButton 
                sx={{ marginLeft: 'auto', color: 'white' }} 
                onClick={() => setOpenDrawer(!openDrawer)}
            >
                <MenuIcon />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComp;