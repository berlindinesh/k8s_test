// src/components/QuickLinks.js
import React from 'react';
import { FaUser, FaPlane, FaCheck, FaCog } from 'react-icons/fa';
import './QuickLinks.css';

const QuickLinks = () => (
  <div className="quick-links">
    <h3>Quick Links</h3>
    <ul>
      <li><FaUser /> Personnel</li>
      <li><FaPlane /> Missions</li>
      <li><FaCheck /> Benefits</li>
      <li><FaCog /> Administration</li>
    </ul>
  </div>
);

export default QuickLinks;
