import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons'; // For website icon

const Footer = () => {
  return (
    <div className='footer'>
        {/* Phone Number */}
        <a href="tel:+919962496842" className='footer-link'>
          <FontAwesomeIcon icon={faPhoneAlt} className="footer-icon" /> +91-9962496842
        </a>

        {/* Website */}
        <a href="https://www.db4cloud.in" target="_blank" rel="noopener noreferrer" className='footer-link'>
          <FontAwesomeIcon icon={faGlobe} className="footer-icon" /> www.db4cloud.in
        </a>

        {/* Address */}
        <a href="https://www.google.com/maps?q=Plot.No.24-261,+Kongareddy+Palli,+Chittoor-517001" target="_blank" rel="noopener noreferrer" className='footer-link'>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" /> Plot.No.24-261, Kongareddy Palli, Chittoor-517001.
        </a>
    </div>
  )
}

export default Footer;
