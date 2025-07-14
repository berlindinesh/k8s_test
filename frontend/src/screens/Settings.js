import React from 'react';
import { Container } from 'react-bootstrap';

const Settings = () => {
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <img 
          src="assets/setting.png" 
          alt="settings" 
          style={{
            maxWidth: '80%',
            height: 'auto'
          }}
        />
      </Container>
      <Container className="text-center">
        <h1 style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          margin: '2rem auto',
          width: '100%',
          color: '#1a1a1a',
          marginTop:'-40px',
        }}>
          502
        </h1>

        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color:'#e54f38',
          marginTop:'-30px',
        }}>
          Sorry, Under Maintenance!
        </h2>

        <p style={{
          fontSize: '1.2rem',
          color: '#111',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto',
          marginBottom: '2rem',

        
        }}>
          We're currently performing scheduled maintenance. We'll be back online shortly.
          Thank you for your patience.
        </p>
      </Container>
    </>
  );
};

export default Settings;



