import React from "react";
import {
    Box,
    FooterContainer,
    Row,
    Column,
    FooterLink,
    Heading,
} from "./FooterStyles.js";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import '../heroSection/heroSection.css';

const Footer = () => {
    return (
        <Box>
            <FooterContainer>
                <Row>
                    <Column>
                        <Heading>About Us</Heading>
                        <FooterLink href="/about-us">
                            About us
                        </FooterLink>
                        <FooterLink href="#">
                            Testimonials
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>Services</Heading>
                        <FooterLink href="#">
                            Sell
                        </FooterLink>
                        <FooterLink href="#">
                            Buy
                        </FooterLink>
                        
                    </Column>
                    <Column>
                        <Heading>Contact Us</Heading>
                        <FooterLink href="#">
                            +961 70 654 802
                        </FooterLink>
                        <FooterLink href="http://gmail.com/" target="_blank">
                            LithiumPower@gmail.com
                        </FooterLink>
                    </Column>
                    <Column>
                        <Heading>Social Media</Heading>
                        <FooterLink href="https://www.facebook.com/" target="_blank">
                            <i className="fab fa-facebook-f">
                            <FacebookIcon sx={{ color: "white" }} />
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Facebook
                                </span>
                            </i>
                        </FooterLink>
                        <FooterLink href="https://instagram.com" target="_blank">
                            <i className="fab fa-instagram">
                            <InstagramIcon sx={{ color: "white" }} />
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    
                                    Instagram
                                </span>
                            </i>
                        </FooterLink>
                        
                        <FooterLink href="https://youtube.com" target="_blank">
                            <i className="fab fa-youtube">
                            <YouTubeIcon sx={{ color: "white" }} />
                                <span
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    Youtube
                                </span>
                            </i>
                        </FooterLink>
                    </Column> 
                </Row>
            </FooterContainer>
        </Box>
    );
};
export default Footer;