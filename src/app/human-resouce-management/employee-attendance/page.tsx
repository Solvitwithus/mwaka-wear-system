"use client"
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Define types for employee data
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Attendance {
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

// Mock API call (replace with actual API call)
const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch('/api/auth/user-detail');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

const AttendancePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      const employeeData = await fetchEmployees();
      setEmployees(employeeData);
      setLoading(false);
    };
    loadEmployees();
  }, []);

  // Handle individual attendance status change
  const handleAttendanceChange = (employeeId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance((prev) => {
      const existing = prev.find(
        (att) => att.employeeId === employeeId && att.date === selectedDate
      );
      if (existing) {
        return prev.map((att) =>
          att.employeeId === employeeId && att.date === selectedDate ? { ...att, status } : att
        );
      }
      return [...prev, { employeeId, date: selectedDate, status }];
    });
  };

  // Handle bulk attendance status change
  const handleSelectAll = (status: 'Present' | 'Absent' | 'Late') => {
    const updatedAttendance = employees.map((employee) => ({
      employeeId: employee.id,
      date: selectedDate,
      status,
    }));
    setAttendance(updatedAttendance);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Save all attendance records
  const handleSaveAttendance = async () => {
    try {
      const response = await fetch('/api/auth/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendance),
      });
      if (response.ok) {
        alert('All attendance records saved successfully!');
        // Optionally reset attendance state after saving
        setAttendance([]);
      } else {
        throw new Error('Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Employee Attendance</h1>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveAttendance}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={attendance.length === 0}
            >
              Save All Attendance
            </button>
          </div>
        </div>

        {/* Search Bar and Select All */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            {['Present', 'Absent', 'Late'].map((status) => (
              <button
                key={status}
                onClick={() => handleSelectAll(status as 'Present' | 'Absent' | 'Late')}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                Mark All {status}
              </button>
            ))}
          </div>
        </div>

        {/* Employee Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const currentStatus = attendance.find(
                    (att) => att.employeeId === employee.id && att.date === selectedDate
                  )?.status || 'Absent';

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          {['Present', 'Absent', 'Late'].map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleAttendanceChange(employee.id, status as 'Present' | 'Absent' | 'Late')
                              }
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                currentStatus === status
                                  ? status === 'Present'
                                    ? 'bg-green-100 text-green-800'
                                    : status === 'Absent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;