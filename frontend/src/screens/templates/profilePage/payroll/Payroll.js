import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

const Payrolls = () => {
  const [open, setOpen] = useState(false);
  const [payrollData, setPayrollData] = useState([
    {
      employee: "Hussam R (PEP00)",
      startDate: "Jan. 1, 2025",
      endDate: "Jan. 7, 2025",
      status: "Review Ongoing",
      grossPay: "443248.33 MYR",
      deduction: "29543.00 MYR",
      netPay: "413705.33 MYR",
    },
    {
      employee: "Hussam R (PEP00)",
      startDate: "Jan. 1, 2025",
      endDate: "Jan. 6, 2025",
      status: "Paid",
      grossPay: "437096.16 MYR",
      deduction: "29210.00 MYR",
      netPay: "407886.16 MYR",
    },
  ]);

  const [formData, setFormData] = useState({
    employee: "",
    startDate: "",
    endDate: "",
    status: "",
    grossPay: "",
    deduction: "",
    netPay: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      employee: "",
      startDate: "",
      endDate: "",
      status: "",
      grossPay: "",
      deduction: "",
      netPay: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setPayrollData((prev) => [...prev, { ...formData }]);
    handleClose();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Payroll Management
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></Box>
            <Typography variant="body2">Paid</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "blue",
              }}
            ></Box>
            <Typography variant="body2">Confirmed</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "orange",
              }}
            ></Box>
            <Typography variant="body2">Review Ongoing</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "gray",
              }}
            ></Box>
            <Typography variant="body2">Draft</Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ marginBottom: 2 }}
      >
        Add Payroll
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Deduction</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color:
                        row.status === "Paid"
                          ? "green"
                          : row.status === "Review Ongoing"
                          ? "orange"
                          : "gray",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor:
                          row.status === "Paid"
                            ? "green"
                            : row.status === "Review Ongoing"
                            ? "orange"
                            : "gray",
                      }}
                    />
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell>{row.grossPay}</TableCell>
                <TableCell>{row.deduction}</TableCell>
                <TableCell>{row.netPay}</TableCell>
                <TableCell>
                  <Button>
                    <DownloadIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Payroll */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Payroll</DialogTitle>
        <DialogContent>
          <TextField
            label="Employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Review Ongoing">Review Ongoing</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
          </Select>
          <TextField
            label="Gross Pay"
            name="grossPay"
            value={formData.grossPay}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Deduction"
            name="deduction"
            value={formData.deduction}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Net Pay"
            name="netPay"
            value={formData.netPay}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payrolls;
