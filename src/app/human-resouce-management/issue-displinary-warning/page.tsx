"use client"
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Define types for employee and warning data
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Warning {
  employeeId: string;
  date: string;
  reason: string;
  details: string;
}

// Mock API call to fetch employees (replace with actual API call)
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

// Mock API call to submit warning (replace with actual API call)
const submitWarning = async (warning: Warning) => {
  try {
    const response = await fetch('/api/auth/warnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(warning),
    });
    return response.ok;
  } catch (error) {
    console.error('Error submitting warning:', error);
    return false;
  }
};

const DisciplinaryWarningPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason || !details) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }

    const warning: Warning = {
      employeeId: selectedEmployeeId,
      date,
      reason,
      details,
    };

    const success = await submitWarning(warning);
    if (success) {
      setSuccessMessage('Warning issued successfully!');
      setErrorMessage('');
      // Reset form
      setSelectedEmployeeId('');
      setReason('');
      setDetails('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    } else {
      setErrorMessage('Failed to issue warning. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Issue Disciplinary Warning</h1>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an employee</option>
                  {filteredEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Warning
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Warning
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Repeated tardiness"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide detailed description of the issue..."
                  rows={5}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={!selectedEmployeeId || !reason || !details}
                >
                  Issue Warning
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisciplinaryWarningPage;