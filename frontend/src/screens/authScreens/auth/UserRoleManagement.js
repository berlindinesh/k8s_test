import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const permissionGroups = {
    'Employee Management': [
      'view_employees', 'edit_employees', 'create_employees', 'delete_employees'
    ],
    'Payroll': [
      'view_payroll', 'manage_payroll'
    ],
    'Leave Management': [
      'view_leave', 'approve_leave', 'manage_leave_policy'
    ],
    'Attendance': [
      'view_attendance', 'manage_attendance'
    ],
    'Reports': [
      'view_reports', 'create_reports'
    ],
    'Settings': [
      'manage_company_settings'
    ]
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/roles/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch users. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/roles/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      // Refresh users to get updated permissions
      fetchUsers();
    } catch (error) {
      setError('Failed to update user role. Please try again.');
      console.error(error);
    }
  };

  const openPermissionEditor = (user) => {
    setSelectedUser(user);
    setSelectedPermissions([...user.permissions]);
    setOpenPermissionsDialog(true);
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const savePermissions = async () => {
    try {
      await axios.put(`/api/roles/users/${selectedUser._id}/permissions`, {
        permissions: selectedPermissions
      });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, permissions: selectedPermissions } 
          : user
      ));
      
      setOpenPermissionsDialog(false);
    } catch (error) {
      setError('Failed to update permissions. Please try again.');
      console.error(error);
    }
  };

  if (loading) return <Typography>Loading users...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Role Management
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.isActive ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => openPermissionEditor(user)}
                  >
                    Edit Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Permissions Dialog */}
      <Dialog 
        open={openPermissionsDialog} 
        onClose={() => setOpenPermissionsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Permissions for {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          {Object.entries(permissionGroups).map(([groupName, permissions]) => (
            <Box key={groupName} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {groupName}
              </Typography>
              <FormGroup>
                {permissions.map(permission => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                      />
                    }
                    label={permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermissionsDialog(false)}>
            Cancel
          </Button>
          <Button onClick={savePermissions} variant="contained">
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserRoleManagement;
