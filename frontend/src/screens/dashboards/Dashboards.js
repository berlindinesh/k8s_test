import React from 'react';
import './Dashboards.css';
import { Button, Container } from 'react-bootstrap';

const dashboardItems = [
  'Affordable Care Act',
  'Compensation and Benefits',
  'Contingent Worker Management',
  'Expense Management',
  'Feature Dashboard',
  'Financials',
  'HCM Data Guide',
  'Marketing',
  'My Dashboard',
  'My Workspace',
  'Procurement',
];

const Dashboards = () => {
  return (
    <Container className="scroll-container">
      {dashboardItems.map((item, index) => (
        <Button
          key={index}
          variant="light"
          className="scroll-button mb-2"
          block
        >
          {item}
        </Button>
      ))}
    </Container>
  );
};

export default Dashboards;
