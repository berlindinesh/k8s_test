import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Attendance = () => {
  const [open, setOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([
    {
      employee: "Adam Luis",
      date: "Nov. 17, 2024",
      day: "Sunday",
      checkIn: "12:02 a.m.",
      inDate: "Nov. 17, 2024",
      checkOut: "-",
      outDate: "-",
      shift: "Morning",
      workType: "Office",
      minHour: "8",
      atWork: "0",
      overtime: "0",
    },
  ]);

  const [formData, setFormData] = useState({
    employee: "",
    attendanceDate: "",
    shift: "",
    workType: "",
    checkInDate: "",
    checkIn: "",
    checkOutDate: "",
    checkOut: "",
    workedHours: "",
    minHours: "",
    description: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      employee: "",
      attendanceDate: "",
      shift: "",
      workType: "",
      checkInDate: "",
      checkIn: "",
      checkOutDate: "",
      checkOut: "",
      workedHours: "",
      minHours: "",
      description: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setAttendanceData((prev) => [
      ...prev,
      {
        employee: formData.employee,
        date: formData.attendanceDate,
        day: new Date(formData.attendanceDate).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        checkIn: formData.checkIn,
        inDate: formData.checkInDate,
        checkOut: formData.checkOut || "-",
        outDate: formData.checkOutDate || "-",
        shift: formData.shift,
        workType: formData.workType,
        minHour: formData.minHours,
        atWork: formData.workedHours,
        overtime: Math.max(0, formData.workedHours - formData.minHours),
      },
    ]);
    handleClose();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Attendance</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpen}>
          Create
        </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>In Date</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Out Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Work Type</TableCell>
              <TableCell>Min Hour</TableCell>
              <TableCell>At Work</TableCell>
              <TableCell>Overtime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.day}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>{row.inDate}</TableCell>
                <TableCell>{row.checkOut}</TableCell>
                <TableCell>{row.outDate}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>{row.workType}</TableCell>
                <TableCell>{row.minHour}</TableCell>
                <TableCell>{row.atWork}</TableCell>
                <TableCell>{row.overtime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Attendance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Attendance Date"
            name="attendanceDate"
            value={formData.attendanceDate}
            onChange={handleChange}
            margin="normal"
            type="date"
          />
          <Select
            fullWidth
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            margin="normal"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Shift
            </MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </Select>
          <Select
            fullWidth
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            margin="normal"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Work Type
            </MenuItem>
            <MenuItem value="Office">Office</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Check-In Date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            margin="normal"
            type="date"
          />
          <TextField
            fullWidth
            label="Check-In Time"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Check-Out Date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            margin="normal"
            type="date"
          />
          <TextField
            fullWidth
            label="Check-Out Time"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Worked Hours"
            name="workedHours"
            value={formData.workedHours}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Minimum Hours"
            name="minHours"
            value={formData.minHours}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
};

export default Attendance;
