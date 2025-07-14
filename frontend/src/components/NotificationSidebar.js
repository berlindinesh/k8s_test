import React, { useEffect, useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Badge, CircularProgress } from '@mui/material';
import { Close, Delete, CheckCircle } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

const NotificationSidebar = ({ show, onClose }) => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    deleteNotification, 
    clearAll, 
    markAllAsRead, 
    getUserNotifications, 
    getUserUnreadCount 
  } = useNotifications();
  
  // Add local loading state to better control the UI
  const [localLoading, setLocalLoading] = useState(true);
  
  // Get the current user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch notifications when the sidebar is opened
  useEffect(() => {
    let isMounted = true;
    
    if (show && userId) {
      setLocalLoading(true);
      
      // Fetch notifications and handle loading state
      fetchNotifications(userId)
        .then(() => {
          // Only update state if component is still mounted
          if (isMounted) {
            setTimeout(() => {
              setLocalLoading(false);
            }, 300);
          }
        })
        .catch(() => {
          if (isMounted) {
            setLocalLoading(false);
          }
        });
    } else {
      setLocalLoading(false);
    }
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [show, userId, fetchNotifications]);

  // Filter notifications to only show those for the current user
  const userNotifications = getUserNotifications(userId);
  const userUnreadCount = getUserUnreadCount(userId);

  // Update the getNotificationStyle function to handle leave request statuses
  const getNotificationStyle = (type, status) => {
    const styles = {
      leave: status === "approved" ? "#e8f5e9" : status === "rejected" ? "#ffebee" : "#e3f2fd",
      timesheet: "#e3f2fd",
      performance: "#fff3e0",
      onboarding: "#f3e5f5",
      payroll: "#e0f2f1"
    };
    return styles[type] || styles.leave;
  };

  // Update the formatTime function to handle ISO timestamps
  const formatTime = (timestamp) => {
    if (timestamp === "Just now") return timestamp;
    
    try {
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - notificationTime) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch (error) {
      return timestamp; // Fallback to the original value if parsing fails
    }
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllAsRead(userId);
    }
  };

  const handleClearAll = () => {
    if (userId) {
      clearAll(userId);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          padding: 2,
          boxShadow: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Notifications
          <Badge 
            badgeContent={userUnreadCount} 
            color="error" 
            sx={{ ml: 1, paddingRight: "5px" }}
          />
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={handleMarkAllAsRead} 
            title="Mark all as read"
            sx={{ mr: 1 }}
            disabled={localLoading}
          >
            <CheckCircle fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleClearAll} 
            title="Clear all notifications"
            sx={{ mr: 1 }}
            disabled={localLoading}
          >
            <Delete fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        {localLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, flexDirection: 'column' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : userNotifications && userNotifications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {userNotifications.map((notification) => (
              <Box
                key={notification._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: getNotificationStyle(notification.type, notification.status),
                  opacity: notification.read ? 0.7 : 1,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(notification.time)}
                  </Typography>
                  <Box>
                    {!notification.read && (
                      <IconButton 
                        size="small" 
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                        sx={{ p: 0.5, mr: 0.5 }}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete notification"
                      sx={{ p: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            ))}
          </div>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationSidebar;
