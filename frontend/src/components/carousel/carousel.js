import { Carousel } from 'antd';
import image1 from './IMAGE2.jpg';
import image2 from './IMAGE1.webp';
import image3 from './IMAGE3.jpg';
import './carousel.css';

const divGeneralStyle = {
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const createImageStyle = (image) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${image})`,
  animation: 'zoomEffect 20s infinite alternate'
});

const slide1 = { ...divGeneralStyle, ...createImageStyle(image1) };
const slide2 = { ...divGeneralStyle, ...createImageStyle(image2) };
const slide3 = { ...divGeneralStyle, ...createImageStyle(image3) };

const typo = {
  h1: {
    color: '#57c1ff',
    fontFamily: 'Montserrat',
    fontSize: '4em',
    textShadow: '0 0 10px rgba(87, 193, 255, 0.8)',
    animation: 'floatText 3s ease-in-out infinite',
    margin: '0',
    padding: '0'
  },
  h2: {
    color: '#fafafa',
    fontFamily: 'Montserrat',
    fontSize: '2em',
    textShadow: '0 0 10px rgba(250, 250, 250, 0.5)',
    animation: 'fadeInUp 1s ease-out',
    margin: '20px 0'
  },
  divider: {
    width: '40%',
    backgroundColor: '#FFFF',
    height: '4px',
    margin: '20px 0',
    transition: 'width 0.8s ease',
    animation: 'expandWidth 1.5s ease-out'
  },
};

const App = () => {
  let carousel;

  const next = () => carousel?.next();
  const previous = () => carousel?.prev();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 5000,
    autoplay: true,
    fade: true,
    pauseOnHover: false,
    className: 'carousel-container'
  };

  return (
    <div className="carousel-wrapper">
      <Carousel {...settings} ref={node => (carousel = node)}>
        <div className="slide-content">
          <div style={slide1}>
            <h1 style={typo.h1}>LITHIUM POWER</h1>
            <div style={typo.divider}></div>
            <h2 style={typo.h2}>Empowering the Future, One Battery at a Time</h2>
          </div>
        </div>

        <div className="slide-content">
          <div style={slide2}>
            <h1 style={typo.h1}>LITHIUM POWER</h1>
            <div style={typo.divider}></div>
            <h2 style={typo.h2}>Empowering the Future, One Battery at a Time</h2>
          </div>
        </div>

        <div className="slide-content">
          <div style={slide3}>
            <h1 style={typo.h1}>LITHIUM POWER</h1>
            <div style={typo.divider}></div>
            <h2 style={typo.h2}>Empowering the Future, One Battery at a Time</h2>
          </div>
        </div>
      </Carousel>

      <button onClick={previous} className="carousel-button prev">
        ‹
      </button>
      <button onClick={next} className="carousel-button next">
        ›
      </button>
    </div>
  );
};

export default App;
