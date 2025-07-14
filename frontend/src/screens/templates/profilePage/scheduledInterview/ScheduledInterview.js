import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ScheduledInterviewPage = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Hussam R's Scheduled Interviews
      </Typography>
      <Card sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Date:</strong> Jan. 16, 2025
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Time:</strong> 9:11 a.m.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Interviewer:</strong>{" "}
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>HR</Avatar> Hussam R (PEP00)
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            asdasdas
          </Typography>
          <Typography variant="body2" sx={{ color: "orange", display: "inline-flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" /> Upcoming Interview
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default ScheduledInterviewPage;
