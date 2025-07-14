  import React, { useState } from "react";
  import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";

  const PenaltyAccount = () => {
    const [penaltyData] = useState([
      {
        leaveType: "vac",
        minusDays: 100.0,
        deductedFromCFD: "No",
        penaltyAmount: "0.0 MYR",
        createdDate: "Jan. 6, 2025, 3:08 a.m."
      },
      {
        leaveType: "Casual Leave",
        minusDays: 2.0,
        deductedFromCFD: "Yes",
        penaltyAmount: "101.0 MYR",
        createdDate: "Jan. 3, 2025, 12:57 p.m."
      },
      {
        leaveType: "Casual Leave",
        minusDays: 1000.0,
        deductedFromCFD: "No",
        penaltyAmount: "0.0 MYR",
        createdDate: "Jan. 2, 2025, 12:48 p.m."
      }
    ]);

    return (
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Minus Days</TableCell>
                <TableCell>Deducted From CFD</TableCell>
                <TableCell>Penalty Amount</TableCell>
                <TableCell>Created Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {penaltyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell>{row.minusDays}</TableCell>
                  <TableCell>{row.deductedFromCFD}</TableCell>
                  <TableCell>{row.penaltyAmount}</TableCell>
                  <TableCell>{row.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  export default PenaltyAccount;
