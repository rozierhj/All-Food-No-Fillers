import React from 'react';
import {Navbar, Container, Button} from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaEnvelope, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () =>{

    const shareUrl = 'https://all-food-no-fillers.onrender.com';
    const shareText = `Check out this delicious recipe platform named All Food No Filler!`;

    return(
        <Navbar bg='dark' variant='dark' className='footer-navbar' fixed='bottom'>
            <Container className='justify-content-center'>
                <div classname='social-buttons'>
                <Button variant="primary" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" className="the-sm-button">
                    <FaFacebook />
                </Button>
                <Button variant="info" href={`https://twitter.com/intent/ttweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" className="the-sm-button">
                    <FaTwitter />
                </Button>
                <Button variant="danger" href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`} target="_blank" className="the-sm-button">
                    <FaInstagram />
                </Button>
                <Button variant="secondary" href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`} target="_blank" className="the-sm-button">
                    <FaEnvelope />
                </Button>
                </div>
            </Container>
        </Navbar>
    )

}

export default Footer;