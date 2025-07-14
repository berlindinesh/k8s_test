import Attendance from '../models/attendanceModel.js';

// Get attendance statistics for dashboard
export const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's attendance records
    const todayRecords = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    });
    
    // Get all employees
    const allEmployees = await Attendance.distinct('empId');
    
    // Calculate present employees
    const presentEmployees = todayRecords.filter(record => 
      record.checkIn && record.checkIn !== '-'
    ).length;
    
    // Calculate late employees
    const lateEmployees = todayRecords.filter(record => {
      if (!record.checkIn || record.checkIn === '-') return false;
      
      // Parse check-in time
      const checkInTime = record.checkIn;
      const [hours, minutes] = checkInTime.split(':').map(Number);
      return (hours > 9 || (hours === 9 && minutes > 30));
    }).length;
    
    // Calculate employees on leave
    const onLeaveEmployees = todayRecords.filter(record => 
      (!record.checkIn || record.checkIn === '-') && 
      record.comment && 
      record.comment.toLowerCase().includes('leave')
    ).length;
    
    // Calculate attendance rate
    const attendanceRate = allEmployees.length > 0 
      ? Math.round((presentEmployees / allEmployees.length) * 100) 
      : 0;
    
    // Calculate average working hours for the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const monthRecords = await Attendance.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      atWork: { $ne: '-' }
    });
    
    let totalWorkHours = 0;
    let workRecordsCount = 0;
    
    monthRecords.forEach(record => {
      if (record.atWork && !isNaN(parseFloat(record.atWork))) {
        totalWorkHours += parseFloat(record.atWork);
        workRecordsCount++;
      }
    });
    
    const averageWorkHours = workRecordsCount > 0 
      ? (totalWorkHours / workRecordsCount).toFixed(1) 
      : 0;
    
    // Get recent attendance records
    const recentAttendance = await Attendance.find()
      .sort({ date: -1 })
      .limit(5)
      .select('name empId date checkIn checkOut comment');
    
    const formattedRecentAttendance = recentAttendance.map(record => {
      let status = 'Absent';
      
      if (record.checkIn && record.checkIn !== '-') {
        // Check if employee was late
        const checkInTime = record.checkIn;
        const [hours, minutes] = checkInTime.split(':').map(Number);
        
        if (hours > 9 || (hours === 9 && minutes > 30)) {
          status = 'Late';
        } else {
          status = 'Present';
        }
      } else if (record.comment && record.comment.toLowerCase().includes('leave')) {
        status = 'On Leave';
      }
      
      return {
        id: record._id,
        name: record.name,
        empId: record.empId,
        status: status,
        time: record.checkIn !== '-' ? record.checkIn : '-',
        date: record.date
      };
    });
    
    // Return the dashboard statistics
    res.status(200).json({
      totalEmployees: allEmployees.length,
      presentToday: presentEmployees,
      lateToday: lateEmployees,
      onLeave: onLeaveEmployees,
      attendanceRate: attendanceRate,
      averageWorkHours: averageWorkHours,
      recentAttendance: formattedRecentAttendance
    });
    
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching attendance statistics', 
      error: error.message 
    });
  }
};

// Get attendance trends for the past week
export const getAttendanceTrends = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get data for the past 7 days
    const pastWeek = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayRecords = await Attendance.find({
        date: { $gte: date, $lt: nextDay }
      });
      
      const presentCount = dayRecords.filter(record => 
        record.checkIn && record.checkIn !== '-'
      ).length;
      
      const absentCount = dayRecords.filter(record => 
        !record.checkIn || record.checkIn === '-'
      ).length;
      
      pastWeek.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: presentCount,
        absent: absentCount
      });
    }
    
    res.status(200).json(pastWeek);
    
  } catch (error) {
    console.error('Error fetching attendance trends:', error);
    res.status(500).json({ 
      message: 'Error fetching attendance trends', 
      error: error.message 
    });
  }
};

// Get work type distribution
export const getWorkTypeDistribution = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const monthRecords = await Attendance.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    // Count records by work type
    const workTypeCount = {
      Regular: 0,
      Remote: 0,
      Hybrid: 0,
      Other: 0
    };
    
    monthRecords.forEach(record => {
      if (!record.workType || record.workType === '-') {
        workTypeCount.Other++;
      } else if (workTypeCount[record.workType] !== undefined) {
        workTypeCount[record.workType]++;
      } else {
        workTypeCount.Other++;
      }
    });
    
    res.status(200).json(workTypeCount);
    
  } catch (error) {
    console.error('Error fetching work type distribution:', error);
    res.status(500).json({ 
      message: 'Error fetching work type distribution', 
      error: error.message 
    });
  }
};

// Get department attendance summary
export const getDepartmentSummary = async (req, res) => {
  try {
    // This would require a department field in your attendance model
    // or a relation to an employee model with department information
    // For now, we'll return a placeholder response
    
    res.status(200).json([
      { department: 'Engineering', presentPercentage: 92, employeeCount: 25 },
      { department: 'Marketing', presentPercentage: 88, employeeCount: 12 },
      { department: 'HR', presentPercentage: 95, employeeCount: 8 },
      { department: 'Finance', presentPercentage: 90, employeeCount: 10 }
    ]);
    
  } catch (error) {
    console.error('Error fetching department summary:', error);
    res.status(500).json({ 
      message: 'Error fetching department summary', 
      error: error.message 
    });
  }
};

export default {
  getAttendanceStats,
  getAttendanceTrends,
  getWorkTypeDistribution,
  getDepartmentSummary
};
