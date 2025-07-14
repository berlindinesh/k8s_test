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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';

const Assets = () => {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const [assets, setAssets] = useState([
    {
      assetName: "AGM",
      description: "Company Phone",
      trackingId: "PHT0039",
      assignedDate: "2025-01-08",
      status: "In Use",
      assignedBy: "hussam r (PEP00)",
      batchNo: "PHB002",
      category: "Phones",
      purpose: "Work Communication",
      height: "15cm",
      width: "7cm",
      profile: "Employee Device"



    },
    // ... other assets
  ]);

  const [formData, setFormData] = useState({
    requestingUser: "",
    assetCategory: "",
    description: "",
    purpose: "",
    height: "",
    width: "",
    profile: ""
  });

  const users = ["John Doe", "Jane Smith", "Mike Johnson"];
  const categories = ["Laptop", "Mobile", "Monitor", "Keyboard"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      requestingUser: "",
      assetCategory: "",
      description: "",
      purpose: "",
      height: "",
      width: "",
      profile: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const newAsset = {
      assetName: formData.assetCategory,
      status: "In Use",
      assignedDate: new Date().toLocaleDateString(),
      category: formData.assetCategory,
      profile: formData.profile,
      purpose: formData.purpose,
      height: formData.height,
      width: formData.width
    };
    setAssets([...assets, newAsset]);
    handleClose();
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setDetailsOpen(true);
  };

  const AssetDetailsDialog = () => (
    <Dialog 
      open={detailsOpen} 
      onClose={() => setDetailsOpen(false)} 
      maxWidth="md"
      PaperProps={{
        sx: {
          width: '600px',
          minHeight: '400px'
        }
      }}
    >
      <DialogTitle>
        Asset Details
        <IconButton
          aria-label="close"
          onClick={() => setDetailsOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <strong>Asset Name:</strong> {selectedAsset?.assetName}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Profile:</strong> {selectedAsset?.profile}
          </Box>
          
          
          <Box sx={{ mb: 2 }}>
            <strong>Description:</strong> {selectedAsset?.description || 'None'}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Tracking Id:</strong> {selectedAsset?.trackingId}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Assigned Date:</strong> {selectedAsset?.assignedDate}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Status:</strong> {selectedAsset?.status}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Assigned By:</strong> {selectedAsset?.assignedBy}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Batch No:</strong> {selectedAsset?.batchNo}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Category:</strong> {selectedAsset?.category}
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<KeyboardReturnIcon />}
            fullWidth
          >
            Return Asset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow 
                key={index}
                onClick={() => handleAssetClick(asset)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>{asset.assignedDate}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<KeyboardReturnIcon />}
                  >
                     Requested to Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Asset Request</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Select
              fullWidth
              name="requestingUser"
              value={formData.requestingUser}
              onChange={handleChange}
              displayEmpty
              label="Requesting User"
            >
              <MenuItem value="" disabled>
                Select User
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <Select
              fullWidth
              name="assetCategory"
              value={formData.assetCategory}
              onChange={handleChange}
              displayEmpty
              label="Asset Category"
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              name="profile"
              label="Profile"
              value={formData.profile}
              onChange={handleChange}
            />
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              name="purpose"
              label="Purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <TextField
              name="height"
              label="Height"
              value={formData.height}
              onChange={handleChange}
            />
            <TextField
              name="width"
              label="Width"
              value={formData.width}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <AssetDetailsDialog />
    </Box>
  );
};

export default Assets;