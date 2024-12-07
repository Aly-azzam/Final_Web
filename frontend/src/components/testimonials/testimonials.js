import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './testimonials.css'
import image1 from './testimonialsImages/image1.jpg'
import image2 from './testimonialsImages/image2.jpg'
import image3 from './testimonialsImages/image3.jpg'

export default class Testimonials extends Component {
    render() {
        return (
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            interval={6100}
          >
            <div style={{margin: '2%'}}>
              <img src={image1} alt="image 1"/>
              <div className="myCarousel">
                <h3>Anna de Armas</h3>
                <h4>Designer</h4>
                <p>
                Lithium Power provided solar panels and inverters that perfectly blend style and efficiency for my studio. Their team designed a custom setup, and I found affordable equipment on their marketplace. Their innovative solutions and seamless process truly reflect the creativity I value.
                </p>
              </div>
            </div>
    
            <div style={{margin: '2%'}}>
              <img src={image2} alt="image 2"/>
              <div className="myCarousel">
                <h3>Brad Pitt</h3>
                <h4>Electrical Engineer</h4>
                <p>
                As an engineer, I trust Lithium Power for their reliable batteries and efficient inverters. Their products are easy to integrate, and the platform allows hassle-free buying and selling. Their focus on quality and sustainability makes them a leader in innovative energy solutions.
                </p>
              </div>
            </div>
    
            <div style={{margin: '2%'}}>
              <img src={image3} alt="image 3"/>
              <div className="myCarousel">
                <h3>Georgina Rodriguez</h3>
                <h4>CCE</h4>
                <p>
                Lithium Power’s lithium batteries and inverters transformed my home office setup. Their high efficiency and long lifespan impressed me. The platform made upgrading seamless, and I easily sold my old equipment. Their reliable products and expert support make them my go-to for energy needs.
                </p>
              </div>
            </div>
          </Carousel>
        );
      }
    }