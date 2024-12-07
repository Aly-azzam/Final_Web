import React from 'react';
import './aboutus.css'
import { TeamData, usjData } from "./data";
import TeamCard from "./team-card";
import Aboutimage from '../../images/about-us.jpg'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  

const AboutUs = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="about-us-container">
      <div className='head'>
        <img src={Aboutimage} alt="About us image" />
        <div>
          <h2>About US</h2>
          <p>
          At Lithium Power, we specialize in high-quality lithium batteries, solar inverters, and solar panels. Our platform enables customers to buy or sell renewable energy products effortlessly. Committed to sustainability, we deliver reliable, eco-friendly, and affordable energy solutions for a brighter future.
          </p>
        </div>
      </div> 
      
      <div className='accordion'>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ backgroundColor: 'black', color: 'white'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#FFFF' }}/>}
          aria-controls="panel1bh-content"
          id="panel1"
        >
          <Typography sx={{ width: '100%', flexShrink: 0, fontWeight: 'bold' }}>
            Our Vision
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          To revolutionize the energy market by becoming the leading platform for high-quality lithium batteries, solar inverters, and panels. We aim to empower individuals and businesses with sustainable, reliable, and affordable energy solutions while fostering a seamless marketplace for buying and selling renewable products.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ backgroundColor: 'black', color: 'white'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#FFFF' }} />}
          aria-controls="panel2bh-content"
          id="panel2"
        >
          <Typography sx={{ width: '100%', flexShrink: 0, fontWeight: 'bold' }}>How It Works</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="seller-container">
            <h4>For Sellers</h4>
            <p>
            As a seller, list your lithium batteries, solar inverters, or solar panels with ease on our platform. Simply upload product details, set a price, and connect with buyers. Our secure system ensures smooth transactions, helping you reach the right audience and sell your products effortlessly.
            </p>
          </div>

          <div className="buyer-container">
            <h4>For Buyers</h4>
            <p>
            As a buyer, discover high-quality lithium batteries, solar inverters, and solar panels on our platform. Browse listings, compare prices, and connect with trusted sellers. Our secure system ensures safe transactions, making it easy to find the perfect product for your energy needs.
            </p>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ backgroundColor: 'black', color: 'white'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#FFFF' }} />}
          aria-controls="panel3bh-content"
          id="panel3"
        >
          <Typography sx={{ width: '100%', flexShrink: 0, fontWeight: 'bold' }}>
            Why Choose Lithium Power
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <ul>
              <li>
                <b>Trusted Quality:</b> Our lithium batteries, inverters, and solar panels are rigorously tested for durability and performance.
              </li>
              <li>
                <b>Affordable Solutions:</b>  We offer competitive prices with options for both new and pre-owned products.
              </li>
              <li>
                <b>Sustainability Focus:</b> Choosing us supports eco-friendly energy solutions for a greener future.
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </div>

      <p style={{ textAlign: 'center' }}>
      "Join Lithium Power and ignite a brighter future, where every spark drives a sustainable tomorrow."
      </p>

      <div>
        <div className="separator"></div>
        <div className="team-intro-container">
            <h1 className="team-title">Our Team</h1>
            <div className="team-members">
                {TeamData.map((member) => (
                    <TeamCard key={member.id} member={member} />
                ))}
            </div>
            
            <div className="usj-container">
            <img src={usjData.photo} alt="USJ Logo" />
            <p className="dr-description">This project was done by Saint Joseph University Engineering Students as a final Web project under the supervision of
                <span className="highlight"> Dr. Anthony Tannoury </span>.
            </p>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AboutUs;
