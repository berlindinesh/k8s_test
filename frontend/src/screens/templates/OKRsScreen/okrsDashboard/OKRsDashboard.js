// src/screens/Dashboard.js
import React, { useState } from 'react';
import CalendarComponent from '../okrsComponents/calendar/Calendar';
import ScheduleList from '../okrsComponents/scheduleList/ScheduleList';
import QuickLinks from '../okrsComponents/quickLinks/QuickLinks';
import SelfService from '../okrsComponents/selfService/SelfService';
import UserProfile from '../okrsComponents/userProfile/UserProfile';
import './OKRsDashboard.css';

const OKRsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
  <div style={{display:"flex", position:"relative", marginLeft:"80%"}} >
    <label htmlFor='dropdown' style={{paddingRight:"10px", fontSize:"16px"}}>Login as:</label>
  <select id='dropdown' style={{alignSelf:"flex-start"}}>
    <option value="admin">Admin</option>
    <option value="user" >User</option>
  </select>
  </div>
  <div style={{alignItems:"flex-end"}}>
    <input type='search' placeholder='Search' style={{borderRadius:"10px"}}/>
  </div>
    <div className="dashboard">
        <div className='profile-calender-container'>
        <UserProfile />
      <div className="left-panel">
        <CalendarComponent onDateClick={handleDateChange}   />
        <ScheduleList selectedDate={selectedDate}  />
      </div>
      </div>
      <div className="right-panel">
        <QuickLinks />
        <SelfService />
      </div>
    </div>
    </>
  );
};

export default OKRsDashboard;
