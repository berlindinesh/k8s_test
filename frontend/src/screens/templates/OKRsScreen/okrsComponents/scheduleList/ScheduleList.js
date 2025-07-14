// // src/components/ScheduleList.js
// import React from 'react';
// import './ScheduleList.css';

// const ScheduleList = ({ selectedDate, schedules }) => {
//   const schedule = schedules.find(sch => sch.date === selectedDate);

//   return (
//     <div className="schedule-list">
//       <h3>{selectedDate || 'Select a date'}</h3>
//       {schedule ? (
//         schedule.events.map((event, index) => (
//           <div key={index} className="schedule-item">
//             <h4>{event.title}</h4>
//             <p>{event.time}</p>
//             <p>{event.location}</p>
//           </div>
//         ))
//       ) : (
//         <p>No events for this day.</p>
//       )}
//     </div>
//   );
// };

// export default ScheduleList;


import React from 'react';
import './ScheduleList.css';

const ScheduleList = ({ selectedDate }) => {
  const schedules = [
    { date: '2023-03-23', title: 'Meeting with Team', time: '10:00 am - 11:00 am', through:"cairo" },
    { date: '2023-03-23', title: 'Client Presentation', time: '01:00 pm - 02:00 pm', through:"ATSMeetingRoom" },
  ];

  const formattedDate = new Date(
    Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )
  ).toISOString().split('T')[0];

  // Debugging logs
  console.log('Formatted selected date:', formattedDate);
  console.log('Available schedules:', schedules);

  // Filter schedules based on the formatted date
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.date === formattedDate
  );

  return (
    <div className="schedule-list">
      <p>{selectedDate.toDateString()}</p>
      {filteredSchedules.length > 0 ? (
        filteredSchedules.map((schedule, index) => (
          <div key={index} className="schedule-item">
            <h6>{schedule.title}</h6>
            <p>{schedule.time}</p>
            <p>{schedule.through}</p>
          </div>
        ))
      ) : (
        <p>No schedules for this date.</p>
      )}
    </div>
  );
};

export default ScheduleList;
