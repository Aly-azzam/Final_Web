import React from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './leafletMap.css';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Signup from '../form/signup';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';


function checkTokenValidity() {
    const token = localStorage.getItem('token');
    return Boolean(token);
  }

const LeafletMap = () => {
    // Beirut's latitude and longitude
    const position = [33.895, 35.4785];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null);

    const [isLoggedIn, setisLoggedIn] = useState(false);

    useEffect(() => {
        // Check token validity on component mount
        setisLoggedIn(checkTokenValidity);
      }, []); // Empty dependency array ensures this effect runs once on mount
    

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
        <section className='lebanonMap'>

            <div>
                <div>
                    <h2>Save Money</h2>
                    <h3>Find your nearest energy storage Provider</h3>
                    <p className='paragraphe-1'>No need to pay high electricity bills anymore. <br/>Connect with local lithium battery energy providers and start saving NOW</p>
                </div>

                <div className='grid-1'>
                    <div className='ads'>
                        <p className='number'>50+</p>
                        <p>We are proud to announce that we have exceeded 50 energy storage locations across Lebanon, helping more communities access sustainable and affordable energy solutions.</p>
                    </div>
                    {!isLoggedIn &&
                    <div className='sign-up'>
                        <Button variant="contained" style={{backgroundColor:'black',color:'white',fontWeight:'900',fontSize:'20px',width:'150px',height:'50px',borderRadius:'80px'}} onClick={() => openDialog('signup')}>Sign Up</Button>
                    </div>
                    }

                </div>

            </div>

            <div className='card'>
                <MapContainer center={position} zoom={8} style={{ width: '100%', height: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                        />
                </MapContainer>
            </div>

        </section>
        {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          // onClose={closeDialog}
          maxWidth="md"
          fullWidth
          // PaperProps={{
          //   style: {
          //     height: '67vh',
          //     width: '40vw',
          //     // minHeight: '30%',
          //     borderRadius: 16,
          //   },
          // }}
          PaperProps={{
            style: {
              height: 'auto', // Set height to auto
              width: '80%', // Adjust width
              maxWidth: '600px', // Set max width
              borderRadius: '16px',
            },
          }}
          static
          // onClose={() => null}
        >
          <DialogTitle>
            <IconButton
              edge="end"
              color="inherit"
              onClick={closeDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {dialogType === 'signup' && <Signup onClose={closeDialog} openDialog={openDialog} openedFromLeafletMap={true}/>}
          </DialogContent>
        </Dialog>
      )}
        </React.Fragment>
    );
}

export default LeafletMap;