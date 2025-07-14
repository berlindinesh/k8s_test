import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const EmployeeDetails = ({employee}) => {
  return (
    <Card className='my-1 p-1' >
        <Row>
            <Col md={4}>
        <Link to={`/employee`}>
            <Card.Img src={employee.img} className='emp-img' />
        </Link>
        </Col>
        <Col md={8}>
        <Card.Body>
            <Card.Title>
                <strong>{employee.name}</strong>
            </Card.Title>
            <Card.Text>
                {employee.email}
            </Card.Text>
            <Card.Text>
                {employee.dob}
            </Card.Text>
            <Card.Text>
                {employee.phone}
            </Card.Text>
            <Card.Text>
                {employee.role}
            </Card.Text>
            <Card.Text>
                {employee.department}
            </Card.Text>
            <Card.Text>
                {employee.Emp_ID}
            </Card.Text>
        </Card.Body>
        </Col>
        </Row>
    </Card>
  )
}

export default EmployeeDetails
