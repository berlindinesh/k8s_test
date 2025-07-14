// src/components/SelfService.js
import React from 'react';
import { FaClipboard, FaCalendarAlt, FaMoneyCheck, FaExclamationTriangle } from 'react-icons/fa';
import './SelfService.css';

const SelfService = () => (
  <div className="self-service">
    <h3>Self Service</h3>
    <ul>
      <li><FaClipboard /> PMS</li>
      <li><FaCalendarAlt /> Leaves</li>
      <li><FaMoneyCheck /> Loans</li>
      <li><FaExclamationTriangle /> Warnings</li>
    </ul>
  </div>
);

export default SelfService;
