import React from 'react';
import { Link } from 'react-router-dom';
import './IconCard.css'; // Add styles here

const IconCard = ({ name, icon, route }) => {
    return (
        <Link to={route} className="icon-card">
            <div className="icon">
                <img src={icon} alt={name} />
            </div>
            <p className="icon-name">{name}</p>
        </Link>
    );
};

export default IconCard;
