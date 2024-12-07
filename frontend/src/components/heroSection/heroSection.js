import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../heroSection/heroSection.css';

function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/src/images/IMAGE1.webp',
    '/src/images/IMAGE2.jpg',
    '/src/images/IMAGE3.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="heroSection">
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentImage ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${image})`
            }}
          />
        ))}
        
        <IconButton 
          className="carousel-button prev" 
          onClick={handlePrevious}
          sx={{ color: '#39FF14' }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        
        <IconButton 
          className="carousel-button next" 
          onClick={handleNext}
          sx={{ color: '#39FF14' }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="hero-content">
        <h1 className='title'>LITHIUMPOWER</h1>
        <div className='separator'></div>
        <h2 className='slogant'>Empowering the Future, One Battery at a Time</h2>
      </div>
    </section>
  );
}

export default HeroSection;