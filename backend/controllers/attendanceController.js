import Attendance from '../models/attendance.js';

const AttendanceController = {
  getAllAttendance: async (req, res) => {
    try {
      const attendance = await Attendance.find().sort({ date: -1 });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createAttendance: async (req, res) => {
    try {
      const attendance = new Attendance({
        ...req.body,
        day: new Date(req.body.date).toLocaleDateString('en-US', { weekday: 'long' })
      });
      const newAttendance = await attendance.save();
      res.status(201).json(newAttendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          day: new Date(req.body.date).toLocaleDateString('en-US', { weekday: 'long' })
        },
        { new: true }
      );
      
      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Record not found' });
      }
      
      res.json(updatedAttendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchAttendance: async (req, res) => {
    const { searchTerm } = req.query;
    try {
      const attendance = await Attendance.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { empId: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  filterAttendance: async (req, res) => {
    try {
      const { employee, workType, shift } = req.query;
      let query = {};

      if (employee) {
        const [name, empId] = employee.split('(');
        query.$or = [
          { name: new RegExp(name.trim(), 'i') },
          { empId: new RegExp(empId.replace(')', '').trim(), 'i') }
        ];
      }

      if (workType) {
        query.workType = new RegExp(`^${workType}$`, 'i');
      }

      if (shift) {
        query.shift = new RegExp(`^${shift}$`, 'i');
      }

      const filteredRecords = await Attendance.find(query).sort({ date: -1 });
      res.json(filteredRecords);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  bulkUpdateSelection: async (req, res) => {
    const { ids, isSelected } = req.body;
    try {
      await Attendance.updateMany(
        { _id: { $in: ids } },
        { $set: { isSelected } }
      );
      res.json({ message: 'Selection updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      await Attendance.findByIdAndDelete(req.params.id);
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAttendanceStats: async (req, res) => {
    try {
      const attendance = await Attendance.find().sort({ date: -1 });
      
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get today's attendance records
      const todayRecords = attendance.filter(record => 
        new Date(record.date) >= today && new Date(record.date) < tomorrow
      );
      
      // Get all unique employees
      const allEmployees = [...new Set(attendance.map(record => record.empId))];
      
      // Calculate present employees
      const presentToday = todayRecords.filter(record => 
        record.checkIn && record.checkIn !== "-"
      ).length;
      
      // Calculate late employees
      const lateToday = todayRecords.filter(record => {
        if (!record.checkIn || record.checkIn === "-") return false;
        
        // Consider employees late if they check in after 9:30 AM
        const checkInTime = record.checkIn;
        const [hours, minutes] = checkInTime.split(':').map(Number);
        return (hours > 9 || (hours === 9 && minutes > 30));
      }).length;
      
      // Calculate employees on leave
      const onLeave = todayRecords.filter(record => 
        (!record.checkIn || record.checkIn === "-") && 
        record.comment && 
        record.comment.toLowerCase().includes('leave')
      ).length;
      
      // Calculate attendance rate
      const attendanceRate = allEmployees.length > 0 
        ? Math.round((presentToday / allEmployees.length) * 100) 
        : 0;
      
      // Calculate average working hours
      const workingRecords = attendance.filter(record => 
        record.atWork && record.atWork !== "-" && !isNaN(parseFloat(record.atWork))
      );
      
      const totalWorkHours = workingRecords.reduce((sum, record) => 
        sum + parseFloat(record.atWork), 0
      );
      
      const averageWorkHours = workingRecords.length > 0 
        ? (totalWorkHours / workingRecords.length).toFixed(1) 
        : 0;
      
      // Get recent attendance (last 5 records)
      const recentAttendance = attendance
        .slice(0, 5)
        .map(record => {
          let status = 'Absent';
          
          if (record.checkIn && record.checkIn !== "-") {
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
            status: status,
            time: record.checkIn !== "-" ? record.checkIn : "-"
          };
        });
      
      res.json({
        totalEmployees: allEmployees.length,
        presentToday,
        lateToday,
        onLeave,
        attendanceRate,
        averageWorkHours,
        recentAttendance
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export { AttendanceController };
