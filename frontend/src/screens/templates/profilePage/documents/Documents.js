import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const Documents = () => {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, title: "License", description: "", status: "completed" },
    { id: 2, title: "Upload SSC Memo", description: "Need it urgently", status: "pending" },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setFormData({ title: "", description: "", status: "pending" });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setDocuments((prev) => [
      ...prev,
      { id: prev.length + 1, ...formData },
    ]);
    handleClose();
  };

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleToggleStatus = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status: doc.status === "completed" ? "pending" : "completed" }
          : doc
      )
    );
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Documents</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create
        </Button>
      </Box>

      {/* Document List */}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                {/* Status Icon */}
                <TableCell align="center">
                  <Box
                    width={16}
                    height={16}
                    borderRadius="50%"
                    bgcolor={doc.status === "completed" ? "green" : "red"}
                  />
                </TableCell>
                {/* Document Title and Description */}
                <TableCell>
                  <Typography variant="body1">{doc.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {doc.description}
                  </Typography>
                </TableCell>
                {/* Action Buttons */}
                <TableCell align="right">
                  <IconButton
                    sx={{ backgroundColor: "green", color: "white", mx: 1 }}
                    onClick={() => handleToggleStatus(doc.id)}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton
                    sx={{ backgroundColor: "orange", color: "white", mx: 1 }}
                    onClick={() => handleToggleStatus(doc.id)}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <IconButton
                    sx={{ backgroundColor: "red", color: "white", mx: 1 }}
                    onClick={() => handleDelete(doc.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Document Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Documents;
