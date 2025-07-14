import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ApplicationForm from './ApplicationForm';

const OpenJobs = () => {
  const [jobs] = useState([
    {
      id: 1,
      company: 'Db4cloud',
      title: 'Recruitment Drive',
      tags: ['Odoo Dev', 'Django Dev'],
      capacity: 15,
      applied: 14,
      duration: '5 months, 2 weeks',
      description:
        'Join our team for an exciting recruitment drive. Work on cutting-edge projects and grow with us. The job involves full-stack development with a focus on Odoo and Django.',
    },
    {
        id: 2,
        company: 'Db4cloud',
        title: 'FutureForce Recruitment',
        tags: ['Sales Man'],
        capacity: 10,
        applied: 3,
        duration: '5 months, 2 weeks',
        description:
          'We are looking for motivated sales professionals to help expand our customer base. Excellent communication skills and a passion for sales are key to success in this role.',
      },
      {
        id: 3,
        company: 'Db4cloud',
        title: 'Hiring Employees',
        tags: ['Odoo Dev', 'Django Dev', 'Training and Development Coordinator'],
        capacity: 5,
        applied: 0,
        duration: '5 months, 2 weeks',
        description:
          'We are hiring employees for various roles including Odoo development, Django development, and Training coordination. Join a dynamic and growing team.',
      },
      {
        id: 4,
        company: 'Db4cloud',
        title: 'Operating Manager',
        tags: ['System Admin'],
        capacity: 1,
        applied: 1,
        duration: '3 days, 22 hours',
        description:
          'This role requires expertise in system administration, ensuring all systems run smoothly and efficiently. You will manage server infrastructure and oversee day-to-day IT operations.',
      },
      {
        id: 5,
        company: 'Db4cloud',
        title: 'مراقب امن وسلامة',
        tags: ['Recruiter'],
        capacity: 1,
        applied: 0,
        duration: '3 days, 11 hours',
        description:
          'This position requires a recruiter who can help find the best talent in the security and safety fields. Arabic language skills are a plus for this role.',
      },
    // Add more job listings as needed
  ]);

  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  const handleApplyNowClick = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleDetailsClick = (job) => {
    setSelectedJobDetails(job);
    setDetailsOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
    setDetailsOpen(false);
    setSelectedJobDetails(null);
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Open Job Listings
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        We’re hiring! Join our team and be part of a vibrant workplace where your talents make a difference.
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.company}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {job.duration}
                </Typography>

                <Box mt={1} mb={2}>
                  {job.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="secondary"
                      variant="outlined"
                      sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                    />
                  ))}
                </Box>

                <Typography variant="h5" fontWeight="bold">
                  {job.title}
                </Typography>

                <Box mt={2} display="flex" alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={(job.applied / job.capacity) * 100}
                    sx={{ flexGrow: 1, marginRight: 1 }}
                  />
                  <Typography variant="body2">
                    {job.applied} Applied of {job.capacity} Capacity
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button variant="outlined" color="primary" onClick={() => handleDetailsClick(job)}>
                  Details
                </Button>
                <Button variant="contained" color="success" onClick={() => handleApplyNowClick(job)}>
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Application Form Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Apply for {selectedJob?.title} at {selectedJob?.company}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 4, backgroundColor: '#f0f4f8' }}>
          <ApplicationForm job={selectedJob} />
        </DialogContent>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog open={detailsOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#424242', color: 'white', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Job Details: {selectedJobDetails?.title} at {selectedJobDetails?.company}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 4, backgroundColor: '#f7f7f7' }}>
          <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
            {selectedJobDetails?.description}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OpenJobs;
