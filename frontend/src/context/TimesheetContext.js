import React, { createContext, useContext, useState } from 'react';

const TimesheetContext = createContext();

export const TimesheetProvider = ({ children }) => {
  const [timesheetStatus, setTimesheetStatus] = useState({
    isCheckedIn: false,
    checkInTime: null,
    currentDuration: 0
  });

  return (
    <TimesheetContext.Provider value={{ timesheetStatus, setTimesheetStatus }}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => useContext(TimesheetContext);
