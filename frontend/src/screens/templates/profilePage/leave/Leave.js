import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Leave = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState({
    leaveType: "",
    startDate: "",
    startDateBreakdown: "full",
    endDate: "",
    endDateBreakdown: "full",
    attachment: "",
    description: ""
  });

  const handleCardClick = (leave) => {
    setSelectedLeave(leave);
    setLeaveRequest((prev) => ({ ...prev, leaveType: leave.type }));
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedLeave(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Leave Request:", leaveRequest);
    handleClose();
  };

  const leaveData = [
    { type: "Sick Leave", shortCode: "SL", available: 7.0, carryForward: 0.0, total: 7.0, taken: 3.0, color: "lavender" },
    { type: "Casual Leave", shortCode: "CL", available: 3.0, carryForward: 0.0, total: 3.0, taken: 4.0, color: "tomato" },
    { type: "Compensatory Leave Type", shortCode: "CT", available: 11.0, carryForward: 1.0, total: 12.0, taken: 0.0, color: "gold" },
    { type: "Vacation", shortCode: "VA", available: 0.5, carryForward: 0.0, total: 0.5, taken: 0.0, color: "purple" },
    { type: "Study Leave", shortCode: "ST", available: 5.0, carryForward: 0.0, total: 5.0, taken: 1.0, color: "skyblue" },
    { type: "Sabbatical", shortCode: "SB", available: 10.0, carryForward: 2.0, total: 12.0, taken: 0.0, color: "orange" },
    { type: "Maternity Leave", shortCode: "ML", available: 90.0, carryForward: 0.0, total: 90.0, taken: 20.0, color: "pink" },
    { type: "Paternity Leave", shortCode: "PL", available: 14.0, carryForward: 0.0, total: 14.0, taken: 5.0, color: "green" },
    { type: "Emergency Leave", shortCode: "EL", available: 2.0, carryForward: 0.0, total: 2.0, taken: 0.0, color: "red" },
    { type: "Unpaid Leave", shortCode: "UL", available: 0.0, carryForward: 0.0, total: 0.0, taken: 0.0, color: "gray" }
  ];

  const leaveTableData = [
    { type: "Sick Leave", shortCode: "SL", startDate: "Jan 8, 2025", endDate: "Jan 8, 2025", requestedDays: 1.0, status: "Approved", color: "lavender" },
    { type: "Casual Leave", shortCode: "CL", startDate: "Jan 20, 2025", endDate: "Jan 20, 2025", requestedDays: 1.0, status: "Rejected", color: "tomato" },
    { type: "Vacation", shortCode: "VA", startDate: "Jan 6, 2025", endDate: "Jan 6, 2025", requestedDays: 0.0, status: "Approved", color: "purple" }
  ];

  return (
    <Box p={3}>
      {/* Card Section with Scrolling */}
      <Box
        sx={{
          maxWidth: "100%",
          maxHeight: 400, 
          overflowX: "auto",
          display: "flex",
          gap: 2,
          padding: 2
        }}
      >
        {leaveData.map((leave, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(leave)}
            sx={{
              cursor: "pointer",
              minWidth: 280,
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: leave.color,
                color: "black",
                fontSize: "1.2rem",
                fontWeight: "bold",
                width: 56,
                height: 56,
                mb: 1
              }}
            >
              {leave.shortCode}
            </Avatar>
            <CardContent sx={{ textAlign: "center", padding: 0 }}>
              <Typography variant="h6" fontWeight="bold">
                {leave.type}
              </Typography>
              <Typography variant="body2">Available Leave Days: {leave.available}</Typography>
              <Typography variant="body2">Carryforward Leave Days: {leave.carryForward}</Typography>
              <Typography variant="body2">Total Leave Days: {leave.total}</Typography>
              <Typography variant="body2">Total Leave Taken: {leave.taken}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Leave Request */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Request {selectedLeave?.type}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Leave Type" name="leaveType" value={leaveRequest.leaveType} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={leaveRequest.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Start Date Breakdown</InputLabel>
                <Select name="startDateBreakdown" value={leaveRequest.startDateBreakdown} onChange={handleInputChange}>
                  <MenuItem value="full">Full Day</MenuItem>
                  <MenuItem value="first">First Half</MenuItem>
                  <MenuItem value="second">Second Half</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={leaveRequest.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>End Date Breakdown</InputLabel>
                <Select name="endDateBreakdown" value={leaveRequest.endDateBreakdown} onChange={handleInputChange}>
                  <MenuItem value="full">Full Day</MenuItem>
                  <MenuItem value="first">First Half</MenuItem>
                  <MenuItem value="second">Second Half</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="file" name="attachment" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={leaveRequest.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Table */}
      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Requested Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
              
            </TableHead>
            <TableBody>


              {leaveTableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: row.color, fontSize: "0.8rem" }}>{row.shortCode}</Avatar>
                      {row.type}
                    </Box>
                  </TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.requestedDays}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: row.status === "Approved" ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
                      ✓
                    </Button>
                    <Button variant="contained" color="error" size="small">
                      ✗
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Floating Add Button */}
      <Fab color="primary" sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Leave;
