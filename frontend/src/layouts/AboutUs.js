import Navbar from '../components/header/header'
import About from '../components/about us/aboutus'
import Footer from '../components/footer/footer'
import { FloatButton } from 'antd';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import scrollToTop from '../components/scrollUtils';

function AboutPage() {

    const navigate = useNavigate();

    return (
        <div className="Home">
          {/* <Navbar /> */}
          <Button
            onClick={() => { navigate('/'); scrollToTop(); }}
            style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'black', color: 'white', marginTop: '5%', marginLeft: '5%' }}
          >
            <ArrowBackIcon />
          </Button>
          
          <About />
          <Footer />
            
          <FloatButton.BackTop style={ { marginRight: '2%'} }/>
        </div>
      );
    }
    
    export default AboutPage;