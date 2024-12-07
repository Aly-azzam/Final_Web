// import HeroSection from '../components/heroSection/heroSection';
import HeroSection from '../components/carousel/carousel';
import Navbar from '../components/header/header'
import Cards from '../components/card/scroll'
import Footer from '../components/footer/footer'
import AboutUsHome from '../components/about us/aboutusHome'
import Testimonial from '../components/testimonials/testimonials'
import SearchResults from '../components/header/SearchResults';
import Features from '../components/features/Features';
import { useState, useRef, useEffect } from 'react';
import Seperator from '../components/seperator';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null);
  const topRef = useRef(null);

  const handleSearchResultsChange = (results) => {
    setSearchResults(results);
  };

  useEffect(() => {
    // Scroll to the SearchResults section when results are available
    if (searchResults.length > 0 && searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchResults]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="Home">
        <div ref={topRef}></div>
        <Navbar onSearchResultsChange={handleSearchResultsChange} />
        <HeroSection/>
        <Seperator />
        {searchResults.length > 0 && (
          <div ref={searchResultsRef}>
            <SearchResults results={searchResults} />
          </div>
        )}
        <Seperator />
        <Features />
        <Cards />
        <AboutUsHome />
        <Testimonial />
        <Footer />

        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'black',
          color: '#666',
          fontSize: '14px'
        }}>
          2024 Lithium Power. All rights reserved.
        </div>

        <button 
          onClick={scrollToTop}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: 'black',
            color: '#39FF14',
            border: '2px solid #39FF14',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 10px #39FF14',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px #39FF14';
            e.currentTarget.style.backgroundColor = '#39FF14';
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 10px #39FF14';
            e.currentTarget.style.backgroundColor = 'black';
            e.currentTarget.style.color = '#39FF14';
          }}
        >
          Back to Top ↑
        </button>
    </div>
  );
}

export default Home;