import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Avatar,
  MenuItem,
} from '@mui/material';

const ApplicationForm = ({ job }) => {
  return (
    <Box component="form" p={3} sx={{ minWidth: '500px' }}>
      {/* Avatar placeholder */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar sx={{ width: 80, height: 80 }} />
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        Apply for {job?.title}
      </Typography>

      <Grid container spacing={2}>
        {/* Name Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            placeholder="e.g. Jane Doe"
            required
          />
        </Grid>

        {/* Job Position Dropdown */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Choose Job Position"
            defaultValue={job?.title || ''}
          >
            <MenuItem value="Odoo Dev">Odoo Dev</MenuItem>
            <MenuItem value="Django Dev">Django Dev</MenuItem>
            <MenuItem value="Sales Man">Sales Man</MenuItem>
            <MenuItem value="System Admin">System Admin</MenuItem>
          </TextField>
        </Grid>

        {/* Email and Phone Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            placeholder="e.g. janedoe@example.com"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            placeholder="e.g. +1 245 999 999"
            required
          />
        </Grid>

        {/* Portfolio and Resume Upload */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Portfolio"
            placeholder="e.g. https://www.linktoportfolio.com/"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ height: '100%' }}
          >
            Upload Resume
            <input type="file" hidden />
          </Button>
        </Grid>

        {/* Gender Field */}
        <Grid item xs={12}>
          <TextField fullWidth select label="Gender" required>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        {/* Address Field */}
        <Grid item xs={12}>
          <TextField fullWidth label="Address" multiline rows={2} required />
        </Grid>

        {/* Country, State, City, Zip Code */}
        <Grid item xs={6} sm={3}>
          <TextField fullWidth label="Country" required />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField fullWidth label="State" required />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField fullWidth label="City" required />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField fullWidth label="Zip Code" required />
        </Grid>

        {/* Apply Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: '#FF5733',
              '&:hover': { backgroundColor: '#E74C3C' },
            }}
          >
            Apply
          </Button>
        </Grid>
      </Grid>

      <Typography variant="body2" align="center" color="textSecondary" mt={2}>
        © 2024 Db4cloud. All rights reserved.
      </Typography>
    </Box>
  );
};

export default ApplicationForm;
