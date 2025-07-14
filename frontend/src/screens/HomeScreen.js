// src/components/Dashboard.js
import React from 'react';
import './HomeScreen.css';
import HomeItem from '../components/HomeItem';
import { Container, Row } from 'react-bootstrap';

const dashboardData = [
  { title: 'My Team', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507563/My_team_otbg4h.png' },
  { title: 'Favorites', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507563/Favourites_vp4kdm.png' },
  { title: 'Team Performance', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507562/Team_Performance_dym6r0.png' },
  { title: 'Talent', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507559/Talent_a7fvyd.png' },
  { title: 'Time Off', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507559/Time_Off_ajbyc0.png' },
  { title: 'Spend Management', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507556/Spend_Management_mhxb1e.png' },
  { title: 'Personal Information', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507560/Personal_Info_cwdtil.png' },
  { title: 'Benefits', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507555/Benefits_ij1hzu.png' },
  { title: 'Pay', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507558/Pay_xfus24.png' },
  { title: 'Big Data Analytics', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507566/Big_Data_idxuez.png' },
  { title: 'Expenses', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507557/Expenses_wqn1rb.png' },
  { title: 'Birthdays', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507554/Birthdays_dkkahy.png' },
  { title: 'Anniversaries', icon: 'https://res.cloudinary.com/djestqza3/image/upload/v1729507559/Anniversaries_tko7ck.png' },
];

const Dashboard = () => {
  

  return (
    <div>
    <Container className="dashboard">
      <Row className="justify-content-center">
        {dashboardData.map((item, index) => (
          <HomeItem key={index} title={item.title} icon={item.icon} />
        ))}
      </Row>
    </Container>
    </div>
  );
};

export default Dashboard;
