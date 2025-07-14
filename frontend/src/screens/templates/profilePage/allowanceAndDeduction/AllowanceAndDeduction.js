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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllowanceAndDeduction = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [allowanceData, setAllowanceData] = useState([
    {
      allowance: "Loan",
      isTaxable: "Yes",
      isConditionBased: "No",
      isFixed: "Yes",
      amount: "1000",
      basedOn: "Basic Pay",
    },
    {
      allowance: "Festive Bonus",
      isTaxable: "Yes",
      isConditionBased: "No",
      isFixed: "Yes",
      amount: "2000",
      basedOn: "Basic Pay",
    },
  ]);

  const [formData, setFormData] = useState({
    allowance: "",
    isTaxable: "",
    isConditionBased: "",
    isFixed: "",
    amount: "",
    basedOn: "",
  });

  // Add this state for bonus dialog
  const [bonusOpen, setBonusOpen] = useState(false);
  const [bonusData, setBonusData] = useState({
    title: '',
    date: '',
    amount: ''
  });

  const handleOpen = () => {
    setEditIndex(null);
    setFormData({
      allowance: "",
      isTaxable: "",
      isConditionBased: "",
      isFixed: "",
      amount: "",
      basedOn: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedData = [...allowanceData];
      updatedData[editIndex] = formData;
      setAllowanceData(updatedData);
    } else {
      setAllowanceData((prev) => [...prev, formData]);
    }
    handleClose();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(allowanceData[index]);
    setOpen(true);
  };

  const handleDelete = (index) => {
    const updatedData = allowanceData.filter((_, i) => i !== index);
    setAllowanceData(updatedData);
  };

  // Add these handlers for bonus
  const handleBonusOpen = () => {
    setBonusOpen(true);
  };

  const handleBonusClose = () => {
    setBonusOpen(false);
  };

  const handleBonusChange = (e) => {
    const { name, value } = e.target;
    setBonusData(prev => ({...prev, [name]: value}));
  };

  const handleBonusSave = () => {
    // Add your save logic here
    console.log('Bonus Data:', bonusData);
    setBonusOpen(false);
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: 2,
        mb: 3
      }}>
        <Typography variant="h6">
          Allowances
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBonusOpen}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}
        >
          + Add Bonus
        </Button>
        <Typography variant="h6">
          Deductions
        </Typography>
      </Box>
     
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mt: 2 }}
      >
        Add Allowance
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Allowance</TableCell>
              
              <TableCell>Is Taxable</TableCell>
              <TableCell>Is Condition Based</TableCell>
              <TableCell>Is Fixed</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Based On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allowanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.allowance}</TableCell>
                <TableCell>{row.isTaxable}</TableCell>
                <TableCell>{row.isConditionBased}</TableCell>
                <TableCell>{row.isFixed}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.basedOn}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    

      {/* Dialog for Adding/Editing */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Allowance" : "Add Allowance"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Allowance"
            name="allowance"
            fullWidth
            value={formData.allowance}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Is Taxable"
            name="isTaxable"
            fullWidth
            value={formData.isTaxable}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Is Condition Based"
            name="isConditionBased"
            fullWidth
            value={formData.isConditionBased}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Is Fixed"
            name="isFixed"
            fullWidth
            value={formData.isFixed}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Based On"
            name="basedOn"
            fullWidth
            value={formData.basedOn}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add this Dialog component */}
      <Dialog open={bonusOpen} onClose={handleBonusClose}>
        <DialogTitle>Add Bonus</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={bonusData.title}
            onChange={handleBonusChange}
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={bonusData.date}
            onChange={handleBonusChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            value={bonusData.amount}
            onChange={handleBonusChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBonusClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBonusSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllowanceAndDeduction;