import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Switch,
  Divider
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const GroupByDialog = ({ open, onClose }) => {
  const [workInfoOpen, setWorkInfoOpen] = useState(false);
  const [groupByEnabled, setGroupByEnabled] = useState(false);

  const workInfoFields = [
    'Select',
    'Employee',
    'Requested Work Type',
    'Current Work Type',
    'Requested Date',
    'Department',
    'Job Position',
    'Reporting Manager'
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Group By Options</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText primary="Group By" />
            <Switch
              checked={groupByEnabled}
              onChange={(e) => setGroupByEnabled(e.target.checked)}
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => setWorkInfoOpen(!workInfoOpen)}>
            <ListItemText primary="Work Info" />
            {workInfoOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={workInfoOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {workInfoFields.map((field) => (
                <ListItem key={field} sx={{ pl: 4 }}>
                  <ListItemText primary={field} />
                  <Switch />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default GroupByDialog;
