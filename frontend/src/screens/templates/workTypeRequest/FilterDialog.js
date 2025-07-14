import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FilterDialog = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState('workInfo');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Filter Options</DialogTitle>
      <DialogContent>
        <Accordion 
          expanded={expanded === 'workInfo'} 
          onChange={handleAccordionChange('workInfo')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Work Info
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Employee" variant="outlined" />
                <TextField fullWidth label="Department" variant="outlined" sx={{ mt: 2 }}/>
                <TextField fullWidth label="Job Position" variant="outlined" sx={{ mt: 2 }}/>
                <TextField fullWidth label="Job Role" variant="outlined" sx={{ mt: 2 }}/>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Shift</InputLabel>
                  <Select label="Shift">
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="night">Night</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Work Type" variant="outlined" />
                <TextField fullWidth label="Company" variant="outlined" sx={{ mt: 2 }}/>
                <TextField fullWidth label="Reporting Manager" variant="outlined" sx={{ mt: 2 }}/>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Is Active"
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'workTypeRequest'} 
          onChange={handleAccordionChange('workTypeRequest')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Work Type Request
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Requested Date"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField 
                  fullWidth 
                  label="Requested Work Type" 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Approved"
                  sx={{ mt: 2 }}
                />
                <TextField 
                  fullWidth 
                  label="Previous Work Type" 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Cancelled"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'advanced'} 
          onChange={handleAccordionChange('advanced')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Advanced
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Requested Date From"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Requested Date Till"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">Apply Filter</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
