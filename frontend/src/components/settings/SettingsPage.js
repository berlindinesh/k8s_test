import React from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import CompanySettings from './CompanySettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const SettingsPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="settings tabs"
          >
            <Tab label="Company Settings" {...a11yProps(0)} />
            <Tab label="User Preferences" {...a11yProps(1)} />
            <Tab label="Notifications" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <CompanySettings />
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Typography>User preferences settings will be available here.</Typography>
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <Typography>Notification settings will be available here.</Typography>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default SettingsPage;
