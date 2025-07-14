import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Card, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

const DocumentManagement = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [educationDetails, setEducationDetails] = useState({});
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Education');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMember, setSelectedMember] = useState('self');
  const [file, setFile] = useState(null);

  const educationDocTypes = [
    { label: 'Secondary Education', value: 'secondary' },
    { label: 'Higher Secondary', value: 'higherSecondary' },
    { label: 'Under Graduate', value: 'underGraduate' },
    { label: 'Post Graduate', value: 'postGraduate' }
  ];

  const personalDocTypes = [
    { label: 'Aadhar Card', value: 'aadhar' },
    { label: 'PAN Card', value: 'pan' },
    { label: 'Family Member Aadhar', value: 'familyAadhar' }
  ];

  useEffect(() => {
    fetchFamilyMembers();
    fetchEducationDetails();
    fetchDocuments();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get('/api/family-details');
      setFamilyMembers(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const fetchEducationDetails = async () => {
    try {
      const response = await axios.get('/api/education-details');
      setEducationDetails(response.data);
    } catch (error) {
      console.error('Error fetching education details:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('documentType', selectedType);
    formData.append('relatedTo', selectedMember);

    try {
      await axios.post('/api/documents/upload', formData);
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Tabs defaultActiveKey="education" className="mb-4">
        <Tab eventKey="education" title="Education Documents">
          <Card>
            <Card.Body>
              <Form onSubmit={handleUpload}>
                <Form.Group>
                  <Form.Label>Document Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {educationDocTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Upload Document</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Form.Group>
                <Button type="submit" className="mt-3">Upload</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="personal" title="Personal Documents">
          <Card>
            <Card.Body>
              <Form onSubmit={handleUpload}>
                <Form.Group>
                  <Form.Label>Document Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {personalDocTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {selectedType === 'familyAadhar' && (
                  <Form.Group>
                    <Form.Label>Family Member</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                    >
                      {familyMembers.map(member => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
                <Form.Group>
                  <Form.Label>Upload Document</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Form.Group>
                <Button type="submit" className="mt-3">Upload</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Table className="mt-4" striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Document Type</th>
            <th>Related To</th>
            <th>Upload Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.category}</td>
              <td>{doc.documentType}</td>
              <td>{doc.relatedTo}</td>
              <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
              <td>{doc.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DocumentManagement;
