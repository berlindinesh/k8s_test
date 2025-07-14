
import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Box, Divider } from '@mui/material';

const CompletePreview = ({ formData }) => {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ''}
          sx={{ width: 100, height: 100, mr: 3 }}
        />
        <Typography variant="h4">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</Typography>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Personal Information</Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><strong>Date of Birth:</strong> {formData.personalInfo.dob}</Typography>
          <Typography><strong>Gender:</strong> {formData.personalInfo.gender}</Typography>
          <Typography><strong>Marital Status:</strong> {formData.personalInfo.maritalStatus}</Typography>
          <Typography><strong>Blood Group:</strong> {formData.personalInfo.bloodGroup}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Caste:</strong> {formData.personalInfo.caste}</Typography>
          <Typography><strong>Category:</strong> {formData.personalInfo.category}</Typography>
          <Typography><strong>Religion:</strong> {formData.personalInfo.religion}</Typography>
          <Typography><strong>Home State:</strong> {formData.personalInfo.homeState}</Typography>
          <Typography><strong>Home District:</strong> {formData.personalInfo.homeDistrict}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Address Information</Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><strong>Present Address:</strong> {formData.addressInfo.presentAddress}</Typography>
          <Typography><strong>Block:</strong> {formData.addressInfo.block}</Typography>
          <Typography><strong>Panchayat:</strong> {formData.addressInfo.panchayat}</Typography>
          <Typography><strong>District:</strong> {formData.addressInfo.district}</Typography>
          <Typography><strong>State:</strong> {formData.addressInfo.state}</Typography>
          <Typography><strong>Pin Code:</strong> {formData.addressInfo.pinCode}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Permanent Address:</strong> {formData.addressInfo.permanentAddress}</Typography>
          <Typography><strong>Permanent Block:</strong> {formData.addressInfo.permanentBlock}</Typography>
          <Typography><strong>Permanent Panchayat:</strong> {formData.addressInfo.permanentPanchayat}</Typography>
          <Typography><strong>Permanent District:</strong> {formData.addressInfo.permanentDistrict}</Typography>
          <Typography><strong>Permanent State:</strong> {formData.addressInfo.permanentState}</Typography>
          <Typography><strong>Permanent Pin Code:</strong> {formData.addressInfo.permanentPinCode}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Joining Details</Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><strong>Date of Appointment:</strong> {formData.joiningDetails.dateOfAppointment}</Typography>
          <Typography><strong>Office Name:</strong> {formData.joiningDetails.officeName}</Typography>
          <Typography><strong>Date of Joining:</strong> {formData.joiningDetails.dateOfJoining}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Initial Designation:</strong> {formData.joiningDetails.initialDesignation}</Typography>
          <Typography><strong>Mode of Recruitment:</strong> {formData.joiningDetails.modeOfRecruitment}</Typography>
          <Typography><strong>Employee Type:</strong> {formData.joiningDetails.employeeType}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Education Details</Typography>
      </Divider>
      {['basic', 'technical', 'professional'].map((eduType) => (
        <Box key={eduType}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>{eduType.charAt(0).toUpperCase() + eduType.slice(1)} Education</Typography>
          {formData.educationDetails[eduType].map((edu, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Typography><strong>Education:</strong> {edu.education}</Typography>
                <Typography><strong>Board:</strong> {edu.board}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><strong>Marks:</strong> {edu.marks}</Typography>
                <Typography><strong>Year:</strong> {edu.year}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><strong>Stream:</strong> {edu.stream}</Typography>
                <Typography><strong>Grade:</strong> {edu.grade}</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Training Details</Typography>
      </Divider>
      {['trainingInIndia', 'trainingAbroad'].map((trainingType) => (
        <Box key={trainingType}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {trainingType === 'trainingInIndia' ? 'Training in India' : 'Training Abroad'}
          </Typography>
          {formData.trainingDetails[trainingType].map((training, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Typography><strong>Type:</strong> {training.type}</Typography>
                <Typography><strong>Topic:</strong> {training.topic}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><strong>Institute:</strong> {training.institute}</Typography>
                <Typography><strong>Sponsor:</strong> {training.sponsor}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><strong>From:</strong> {training.from}</Typography>
                <Typography><strong>To:</strong> {training.to}</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Service History</Typography>
      </Divider>
      {formData.serviceHistory.map((service, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography><strong>Transaction Type:</strong> {service.transactionType}</Typography>
            <Typography><strong>Office:</strong> {service.office}</Typography>
            <Typography><strong>Post:</strong> {service.post}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography><strong>Order Number:</strong> {service.orderNumber}</Typography>
            <Typography><strong>Order Date:</strong> {service.orderDate}</Typography>
            <Typography><strong>Increment Date:</strong> {service.incrementDate}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography><strong>Pay Scale:</strong> {service.payScale}</Typography>
            <Typography><strong>Other Department:</strong> {service.otherDept}</Typography>
            <Typography><strong>Area Type:</strong> {service.areaType}</Typography>
          </Grid>
        </Grid>
      ))}

      <Divider sx={{ my: 3 }}>
        <Typography variant="h6">Nomination Details</Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography><strong>Name:</strong> {formData.nominationDetails.name}</Typography>
          <Typography><strong>Relation:</strong> {formData.nominationDetails.relation}</Typography>
          <Typography><strong>Type of Nomination:</strong> {formData.nominationDetails.typeOfNomination}</Typography>
          <Typography><strong>Nomination Percentage:</strong> {formData.nominationDetails.nominationPercentage}</Typography>
          <Typography><strong>Nominee Age:</strong> {formData.nominationDetails.nomineeAge}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Present Address:</strong> {formData.nominationDetails.presentAddress}</Typography>
          <Typography><strong>Block:</strong> {formData.nominationDetails.block}</Typography>
          <Typography><strong>Panchayat Mandal:</strong> {formData.nominationDetails.panchayatMandal}</Typography>
          <Typography><strong>District:</strong> {formData.nominationDetails.district}</Typography>
          <Typography><strong>State:</strong> {formData.nominationDetails.state}</Typography>
          <Typography><strong>Pin Code:</strong> {formData.nominationDetails.pinCode}</Typography>
          <Typography><strong>Phone Number:</strong> {formData.nominationDetails.phoneNumber}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompletePreview;
