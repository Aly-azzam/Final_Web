// CardComponent.js
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './card.css'
// import myimage from "../../images/heroSection.jpg"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const style1 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid black',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
};

const flexAlignCenter = {
  display: 'flex',
  alignItems: 'center',
};

const CardComponent = ({ cardData }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { title, location, price, description, user, image } = cardData;
  const { firstName, lastName, email, phoneNumber } = user || {};

  const serverBaseUrl = 'http://localhost:3001';
  const absoluteImageUrl = `${serverBaseUrl}/${image}`;

  return (
    // maxWidth: 345
    <Card sx={{ maxWidth: 600, margin: '5%' }}> 
      <CardActionArea onClick={handleOpen}>
        <CardMedia component="img" height="140" image={absoluteImageUrl} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" fontSize={'160%'}>
            {title}
          </Typography>
          <Typography variant="body2" style={flexAlignCenter}>
            <LocationOnIcon fontSize="medium" style={{ marginRight: '4px' }} />
            {location}
          </Typography>
          <Typography variant="body2" style={flexAlignCenter}>
            <AttachMoneyIcon fontSize='medium' style={{ marginRight: '4px' }} />
            {price}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          <img src={absoluteImageUrl} alt={title} style={{ width: '100%', borderRadius: '8px' }} />
          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <div className="grid-container">
            <div className="grid-item">
              <Typography variant="body2" style={flexAlignCenter}>
                <LocationOnIcon fontSize="medium" style={{ marginRight: '4px' }} />
                {location}
              </Typography>
              <Typography variant="body2" style={flexAlignCenter}>
                <AttachMoneyIcon fontSize='medium' style={{ marginRight: '4px' }} />
                {price}
              </Typography>
            </div>
            <div className="grid-item" >
              {user && (
                <>
                  <Typography variant="body2" style={flexAlignCenter}>
                    <PersonIcon fontSize='medium' style={{ marginRight: '4px', color: '#57c1ff' }} />
                    {`${firstName} ${lastName}`}
                  </Typography>
                  <Typography variant="body2" style={flexAlignCenter}>
                    <EmailIcon fontSize='medium' style={{ marginRight: '4px', color: '#57c1ff' }} />
                    {email}
                  </Typography>
                  <Typography variant="body2" style={flexAlignCenter}>
                    <LocalPhoneIcon fontSize='medium' style={{ marginRight: '4px', color: '#57c1ff' }} />
                    {phoneNumber}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Modal>
    </Card>
  );
};

export default CardComponent;
