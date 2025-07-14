import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';

const CreateWorkTypeDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    employee: '',
    requestedWorkType: '',
    requestedDate: '',
    requestedTill: '',
    description: '',
    isPermanent: false
  });

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Work Type Request</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Employee</InputLabel>
          <Select
            value={formData.employee}
            onChange={(e) => setFormData({...formData, employee: e.target.value})}
          >
            <MenuItem value="emp1">Employee 1</MenuItem>
            <MenuItem value="emp2">Employee 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Requesting Work Type</InputLabel>
          <Select
            value={formData.requestedWorkType}
            onChange={(e) => setFormData({...formData, requestedWorkType: e.target.value})}
          >
            <MenuItem value="type1">Work  from Home</MenuItem>
            <MenuItem value="type2">Work from office</MenuItem>
            <MenuItem value="type2">Remote job </MenuItem>
            <MenuItem value="type2">Manager</MenuItem>
            <MenuItem value="type2">Permanent</MenuItem>


          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Requested Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.requestedDate}
          onChange={(e) => setFormData({...formData, requestedDate: e.target.value})}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Requested Till"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.requestedTill}
          onChange={(e) => setFormData({...formData, requestedTill: e.target.value})}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isPermanent}
              onChange={(e) => setFormData({...formData, isPermanent: e.target.checked})}
            />
          }
          label="Permanent Request"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkTypeDialog;
