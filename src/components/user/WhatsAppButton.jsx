
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const whatsappStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#25D366',
    color: 'white',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  };

  return (
    <a
      href="https://wa.me/919529899999"
      target="_blank"
      rel="noopener noreferrer"
      style={whatsappStyle}
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsAppButton;
