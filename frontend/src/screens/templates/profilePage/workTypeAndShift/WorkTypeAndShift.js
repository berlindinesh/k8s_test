import React, {useState} from 'react'
import { FaUserAlt, FaCalendarAlt, FaSyncAlt, FaExchangeAlt } from 'react-icons/fa';
import { Modal, Table, Button, Form, Card, Tab, Nav, Container } from 'react-bootstrap';


const WorkTypeAndShift = () => {

    const data = [
        {
          employee: 'John Doe',
          requestedWorkType: 'Remote Work',
          previousWorkType: 'Office Work',
          requestedDate: 'Nov. 12, 2024',
          requestedTill: 'Nov. 22, 2024',
          description: 'Request to work remotely due to personal reasons.',
          status: 'Pending',
        },
        {
          employee: 'Jane Smith',
          requestedWorkType: 'Flexible Hours',
          previousWorkType: '9-5 Shift',
          requestedDate: 'Nov. 15, 2024',
          requestedTill: 'Nov. 25, 2024',
          description: 'Request to switch to flexible hours for work-life balance.',
          status: 'Approved',
        },
      ];

    const [workTypeKey, setWorkTypeKey] = useState('workTypeRequest')
    const [subTabKey, setSubTabKey] = useState('workInfo');
    const [showModal, setShowModal] = useState(false);

    const handleModalToggle = () => setShowModal(!showModal);

    return (
        <div>
            <Button variant="primary" onClick={handleModalToggle}>Reallocate Shift</Button>

            {/* Modal for Reallocate Shift */}
            <Modal show={showModal} onHide={handleModalToggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Reallocate Shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="employee">
                            <Form.Label>Employee</Form.Label>
                            <Form.Control type="text" placeholder="Enter Employee" />
                        </Form.Group>
                        <Form.Group controlId="requestingShift">
                            <Form.Label>Requesting Shift</Form.Label>
                            <Form.Control type="text" placeholder="Enter Requesting Shift" />
                        </Form.Group>
                        <Form.Group controlId="requestedDate">
                            <Form.Label>Requested Date</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                        <Form.Group controlId="reallocateEmployee">
                            <Form.Label>Reallocate Employee</Form.Label>
                            <Form.Control type="text" placeholder="Enter Reallocate Employee" />
                        </Form.Group>
                        <Form.Group controlId="requestedTillDate">
                            <Form.Label>Requested Till Date</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter Description" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Sub-tabs for Work Type & Shift section */}
            <Card className="mt-3" style={{borderRadius: "10px", width:"100%"}}>
                <Tab.Container activeKey={subTabKey} onSelect={(k) => setSubTabKey(k)} >
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="workTypeRequest"> <FaUserAlt className="sub-tab-icon" /> Work Type Request</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="rotatingWorkType"> <FaSyncAlt className="sub-tab-icon" /> Rotating Work Type</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="shiftRequest"> <FaCalendarAlt className="sub-tab-icon" /> Shift Request</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="rotatingShift"> <FaExchangeAlt className="sub-tab-icon" /> Rotating Shift</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Card.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="workTypeRequest" activeKey={workTypeKey} onSelect={(k) => setWorkTypeKey(k)}>
                                <Container>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Requested Work Type</th>
                                                <th>Previous/Current Work Type</th>
                                                <th>Requested Date</th>
                                                <th>Requested Till</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.employee}</td>
                                                    <td>{row.requestedWorkType}</td>
                                                    <td>{row.previousWorkType}</td>
                                                    <td>{row.requestedDate}</td>
                                                    <td>{row.requestedTill}</td>
                                                    <td>{row.description}</td>
                                                    <td>{row.status}</td>
                                                    <td>
                                                        <Button variant="info" size="sm">View</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="success" size="sm">Approve</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="danger" size="sm">Reject</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Container>
                            </Tab.Pane>
                            <Tab.Pane eventKey="rotatingWorkType">
                                <Container>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Requested Work Type</th>
                                                <th>Previous/Current Work Type</th>
                                                <th>Requested Date</th>
                                                <th>Requested Till</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.employee}</td>
                                                    <td>{row.requestedWorkType}</td>
                                                    <td>{row.previousWorkType}</td>
                                                    <td>{row.requestedDate}</td>
                                                    <td>{row.requestedTill}</td>
                                                    <td>{row.description}</td>
                                                    <td>{row.status}</td>
                                                    <td>
                                                        <Button variant="info" size="sm">View</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="success" size="sm">Approve</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="danger" size="sm">Reject</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Container>
                            </Tab.Pane>
                            <Tab.Pane eventKey="shiftRequest">
                                <Container>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Employee</th>
                                                <th>Requested Work Type</th>
                                                <th>Previous/Current Work Type</th>
                                                <th>Requested Date</th>
                                                <th>Requested Till</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.employee}</td>
                                                    <td>{row.requestedWorkType}</td>
                                                    <td>{row.previousWorkType}</td>
                                                    <td>{row.requestedDate}</td>
                                                    <td>{row.requestedTill}</td>
                                                    <td>{row.description}</td>
                                                    <td>{row.status}</td>
                                                    <td>
                                                        <Button variant="info" size="sm">View</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="success" size="sm">Approve</Button>{' '}
                                                        <Button style={{ margin: "5px" }} variant="danger" size="sm">Reject</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Container>
                            </Tab.Pane>
                            <Tab.Pane eventKey="rotatingShift">
                                <Container className='mt-5' style={{ textAlign: "center", color: "gray" }}>
                                    <h3>No rotating shift has been assigned.</h3>
                                </Container>
                            </Tab.Pane>
                        </Tab.Content>
                    </Card.Body>
                </Tab.Container>
            </Card>
        </div>
    )
}

export default WorkTypeAndShift
