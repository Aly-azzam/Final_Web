import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './layouts/home';
import AboutUs from './layouts/AboutUs';
import Sell from './components/sell/sell';
import Buy from './components/buy/buy';
import Header from './components/header/header';
import PersonalInfo from './components/profile/PersonalInfo';
import MyProducts from './components/myproducts/MyProducts';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResultsChange = (results) => {
    setSearchResults(results);
  };

  return (
    <GoogleOAuthProvider clientId="716688971918-iup3ekqigrasvp396fp524kl9floser0.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Header onSearchResultsChange={handleSearchResultsChange} />
          <Routes>
            <Route path="/" element={<Home searchResults={searchResults} onSearchResultsChange={handleSearchResultsChange} />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/buy" element={<Buy searchResults={searchResults} />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/my-products" element={<MyProducts />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
