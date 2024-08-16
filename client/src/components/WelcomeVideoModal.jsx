import {useEffect, useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {useQuery} from '@apollo/client';
import {GET_WELCOME_VIDEO} from '../utils/queries';
import '../assets/welcome.mp4';
import '../../public/welcome.mp4';
import './WelcomeVideoModal.css';

const WelcomeVideoModal = ({show, handleClose})=>{

    const {loading, error, data} = useQuery(GET_WELCOME_VIDEO);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() =>{
        if(data){
            setVideoUrl(data.getWelcomeVideo);
        }
    }, [data]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error fetching video!</p>;

    return (
    <Modal show={show} onHide={handleClose} centered dialogClassName='custom-modal' aria-labelledby="video-modal" >
        <Modal.Header closeButton>
            <Modal.Title>Welcome to the Platform!</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <video width="100%" height="auto" controls autoPlay style={{maxHeight: 'calc(80vh - 100px'}}>
                <source src={'/welcome.mp4'} type='video/mp4'/>
            </video>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Body>
        <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
                Close
            </Button> */}
        </Modal.Footer>
    </Modal>

);
};

export default WelcomeVideoModal;