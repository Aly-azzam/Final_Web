import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PublicIcon from '@mui/icons-material/Public';

const Features = () => {
  const features = [
    {
      icon: <VerifiedIcon sx={{ fontSize: 60, color: '#32CD32' }} />,
      title: 'Global Quality Standards',
      description: 'At LITHIUM POWER, we adhere to the highest global quality standards, ensuring that every battery meets rigorous safety, performance, and sustainability benchmarks for our valued customers worldwide.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 60, color: '#32CD32' }} />,
      title: 'Customized Service',
      description: 'At LITHIUM POWER, we pride ourselves on delivering customized services designed to cater to your unique energy requirements. Whether you are looking for the perfect battery for personal use, industrial applications, or renewable energy systems, our team of experts is dedicated to understanding your needs and providing tailored solutions. From product recommendations to after-sales support, we ensure a seamless and personalized experience that prioritizes your satisfaction and long-term success.'
    },
    {
      icon: <PublicIcon sx={{ fontSize: 60, color: '#32CD32' }} />,
      title: 'Global Reach & Experience',
      description: 'At LITHIUM POWER, our global reach ensures seamless access to high-quality batteries across continents. Backed by years of industry experience, we deliver reliable energy solutions that meet diverse needs worldwide. Combining international presence with local expertise, we empower our customers to achieve their energy goals effortlessly.'
    }
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'black' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: 'black',
                  border: '2px solid #32CD32',
                  borderRadius: '15px'
                }}
              >
                {feature.icon}
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    mt: 2, 
                    mb: 1,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: 'white',
                    lineHeight: 1.7
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
