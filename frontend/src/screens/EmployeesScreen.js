import React, { useState, useEffect } from 'react';
import EmployeeDetails from '../components/EmployeeDetails';
import { Modal, Button, Form } from 'react-bootstrap'; // Importing from React-Bootstrap
import axios from 'axios'

const EmployeesScreen = () => {
  const [employeesData, setEmployeesData] = useState([]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    dob: '',
    img: '',
    phone: '',
    location: '',
    role: '',
    department: '',
    Emp_ID: '',
  });

  const [showModal, setShowModal] = useState(false); // For showing and hiding the modal
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null); // File state to store image file

  useEffect(()=>{
    const fetchData=async()=>{
      const response = await axios.get('/api/employees')
      const {data} = await response
      console.log(data)
      setEmployeesData(data)
    }
    fetchData()
  }, [])

  // Handle image upload and store file in state
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Store the file

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Use FormData to send both form fields and the file
    const formData = new FormData();
    formData.append('name', newEmployee.name);
    formData.append('email', newEmployee.email);
    formData.append('dob', newEmployee.dob);
    formData.append('phone', newEmployee.phone);
    formData.append('location', newEmployee.location);
    formData.append('role', newEmployee.role);
    formData.append('department', newEmployee.department);
    formData.append('Emp_ID', Date.now().toString()); // Generating Emp_ID

    if (file) {
      formData.append('img', file); // Append the file to FormData
    }

    try {
      const {data} = await axios.post('/api/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Set headers for multipart data
      });
      console.log(data);

      setEmployeesData((prevData) => [...prevData, data]); // Add the new employee to the state

      setShowModal(false); // Hide the modal after adding the employee
      setNewEmployee({
        name: '',
        email: '',
        dob: '',
        img: '',
        phone: '',
        location: '',
        role: '',
        department: '',
        Emp_ID: '',
      });
      setFile(null); // Reset the file input
      setImagePreview(null); // Clear the image preview
    } catch (error) {
      console.error('Error uploading employee data:', error);
    }
  };

  return (
    <div>
      <h1>Employees List</h1>

      {/* Button to show the modal */}
      <div style={{textAlign:"right"}}>
      <Button variant="primary" style={{backgroundColor:"#457d88f6", border:"none"}}  onClick={() => setShowModal(true)}>
        +Add New Employee
      </Button>
      </div>
      {/* React-Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className='formName'>
              <Form.Label className='modelLabel' >Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                className='modalInput'
                placeholder="Enter name"
                value={newEmployee.name}
                onChange={handleChange}
                required
              />
            </Form.Group >
            <Form.Group controlId="formEmail" className='formName'>
              <Form.Label className='modelLabel'>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                className='modalInput'
                placeholder="Enter email"
                value={newEmployee.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDob" className='formName'>
              <Form.Label className='modelLabel'>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                className='modalInput'
                value={newEmployee.dob}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImg" className='formName'>
              <Form.Label className='modelLabel'>Image</Form.Label>
              <Form.Control
                type="file"
                name="img"
                className='modalImgInput'
                onChange={handleImageUpload}
                required
              />
            </Form.Group>
            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginBottom: '15px'}}>
                <img
                  src={imagePreview}
                  alt="Employee pic"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </div>
            )}
            <Form.Group controlId="formPhone" className='formName'>
              <Form.Label className='modelLabel'>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                className='modalInput'
                value={newEmployee.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className='formName' >
              <Form.Label className='modelLabel'>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Enter location"
                className='modalInput'
                value={newEmployee.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole" className='formName'>
              <Form.Label className='modelLabel'>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                placeholder="Enter role"
                className='modalInput'
                value={newEmployee.role}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDepartment" className='formName'>
              <Form.Label className='modelLabel'>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                className='modalInput'
                placeholder="Enter department"
                value={newEmployee.department}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Employee list */}
      <ul style={{ listStyleType: 'none' }}>
        {employeesData.map((emp) => (
          <li key={emp.Emp_ID}>
            <EmployeeDetails employee={emp} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeesScreen;
