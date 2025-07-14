// src/components/UserProfile.js
import React from 'react';
import './UserProfile.css';

const UserProfile = () => (
  <div className="user-profile">
    <div className="profile-image">
      <img src="https://res.cloudinary.com/djestqza3/image/upload/v1729150620/User_Profile_br0klu.png" alt="Profile" />
    </div>
    <div className="greeting">
      <h2>Good Afternoon!</h2>
      <p>ATS User 3</p>
      <p>PowerHR Application</p>
    </div>
  </div>
);

export default UserProfile;
