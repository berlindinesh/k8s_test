import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calender.css';

const CalendarComponent = ({ onDateClick }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {

    const utcDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    )

    setDate(utcDate);
    onDateClick(utcDate);
  };

  return (
    <div className="calendar-container">
      <Calendar 
        onChange={handleDateChange} 
        value={date}   
        nextLabel=">"
        prevLabel="<"
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={true}
      />
    </div>
  );
};

export default CalendarComponent;
