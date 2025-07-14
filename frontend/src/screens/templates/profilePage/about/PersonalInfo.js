import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const PersonalInfo = ({ personalInfo }) => {
  return (
    <Card style={{ borderRadius: "10px", width:"100%"}}>
      <Card.Body>
        <h6>Personal Information</h6>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Name:</strong> {personalInfo.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email:</strong> {personalInfo.email}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Phone:</strong> {personalInfo.phone}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Date of Birth:</strong> {personalInfo.dob}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Address:</strong> {personalInfo.address}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Pin Code:</strong> {personalInfo.pinCode}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>State:</strong> {personalInfo.state}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>District:</strong> {personalInfo.district}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Marital Status:</strong> {personalInfo.maritalStatus}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Qualification:</strong> {personalInfo.qualification}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PersonalInfo;
