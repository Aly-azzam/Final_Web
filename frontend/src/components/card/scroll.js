import React, { useRef, useEffect, useState } from 'react';
import './scroll.css'; // Import your CSS file for styling
import CardComponent from './card';
// import cardData from './cardData.json';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import axios from 'axios';


const MainComponent = () => {
  const listRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1); // Number of cards visible on the screen
  const [solarPanels, setSolarPanels] = useState([]);

  useEffect(() => {
    (async () => {
      // Fetch the first 10 solar panels from your API
      try {
        const response = await axios.get('http://localhost:3001/solar-panel/solar-panels/first-10');
        setSolarPanels(response.data.data);

        // Calculate the width of one card and set it in the state
        if (listRef.current && listRef.current.firstChild) {
          const firstCard = listRef.current.firstChild;
          const cardStyle = window.getComputedStyle(firstCard);
          const margin = parseFloat(cardStyle.marginRight);
          const cardTotalWidth = firstCard.offsetWidth + margin;
          setCardWidth(cardTotalWidth);

          // Calculate the number of cards visible on the screen
          const containerWidth = listRef.current.clientWidth;
          const newCardsPerPage = Math.floor(containerWidth / cardTotalWidth);
          setCardsPerPage(newCardsPerPage);
        }
      } catch (error) {
        console.error('Error litihum batteries :', error.response?.data);
      }
    })();
  }, []); 

  const handleScroll = (direction) => {
    // const scrollAmount = cardsPerPage * cardWidth; // Scroll based on the number of cards visible
    const scrollAmount = cardWidth;
    const currentScrollPosition = listRef.current.scrollLeft;
    const maxScroll = listRef.current.scrollWidth - listRef.current.clientWidth;

    if (direction === 'left') {
      listRef.current.scrollLeft = Math.max(currentScrollPosition - scrollAmount, 0);
    } else if (direction === 'right') {
      listRef.current.scrollLeft = Math.min(currentScrollPosition + scrollAmount, maxScroll);
    }
  };
  return (
    <div className="main-container">
      <IconButton size="large" onClick={() => handleScroll('left')}>
         <ArrowCircleLeftIcon fontSize="large" style={{ color: "#57c1ff" }} />
       </IconButton>
      <div className="list-container" ref={listRef}>
      {solarPanels.map((solarPanel) => (
          <div key={solarPanel._id} className="list-item">
            <CardComponent cardData={solarPanel} />
          </div>
        ))}
      </div>
      <IconButton size="large" onClick={() => handleScroll('right')}>
         <ArrowCircleRightIcon fontSize="large" style={{ color: "#57c1ff" }} />
      </IconButton>
    </div>
  );
};

export default MainComponent;
