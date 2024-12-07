import React from 'react';
import Button from '@mui/material/Button';
import AboutUsImage from '../../images/about-us.jpg';
import './aboutusHome.css';
import { useNavigate } from 'react-router-dom';
import scrollToTop from '../scrollUtils';

const AboutHome = () => {
    const navigate = useNavigate();

    return (
        <section className='AboutUs'>
            <div className='image-container'>
                <img src={AboutUsImage} alt="About us image" className='image'/>
            </div>
            <div className='text-container'>
                <div>
                    <h2>About Us</h2>
                    <p className='paragraphe-1'>At Lithium Power, we specialize in high-quality lithium batteries, solar inverters, and solar panels. Our platform enables customers to buy or sell renewable energy products effortlessly. Committed to sustainability, we deliver reliable, eco-friendly, and affordable energy solutions for a brighter future. </p>
                </div>

                <div className='grid-1'>
                    <div className='sign-up'>
                        <Button variant="contained" onClick={() => { navigate('/about-us'); scrollToTop(); }} style={{backgroundColor:'black',color:'white',fontWeight:'900',fontSize:'20px',width:'200px',height:'50px',borderRadius:'80px'}}>Learn More</Button>
                    </div>

                </div>
            </div>

        </section>
    );
}

export default AboutHome;
