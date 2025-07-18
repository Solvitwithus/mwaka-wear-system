"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

type Department = {
  departmentName: string;
};

type Role = {
  id: string;
  name: string;
  description?: string;
};
type User = {
  id: string;
  firstName: string;
  lastName: string;
    branch: string;
    role:Role;

};

const Page = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const currentDate = new Date().toLocaleDateString();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Form state
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [areaOfTraining, setAreaOfTraining] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Time updater
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([
          axios.get("/api/auth/create-department"),
          axios.get("/api/auth/user-detail"),
        ]);
        setDepartments(deptRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
const SubmitData = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!selectedDept || !areaOfTraining || !startDate || !endDate || selectedUsers.length === 0) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    setError(""); // clear previous error
    setLoading(true);

    const payload = {
      requestDate: currentDate,
      requestTime: currentTime,
      department: selectedDept,
      currentTime,
      areaOfTraining,
      targetGroup: selectedUsers.join(","), // Store as comma-separated string
      budget,
      startDate,
      endDate,
      remarks,
    };

    const res = await axios.post("/api/auth/training-request", payload);

    if (res.status === 201 || res.status === 200) {
      alert("Training request submitted successfully.");
      // Reset form
      setSelectedDept("");
      setAreaOfTraining("");
      setSelectedUsers([]);
      setBudget(0);
      setStartDate("");
      setEndDate("");
      setRemarks("");
    } else {
      setError("Failed to submit training request.");
    }
  } catch (err) {
    console.error("Submission error:", err);
    setError("An error occurred while submitting the request.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h2 className="text-xl font-bold mb-1 text-center text-green-700">
        Training Request Form
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="col-span-2 flex justify-between text-sm text-gray-600 mb-1">
            <div>
              <strong>Request Date:</strong> {currentDate}
            </div>
            <div>
              <strong>Current Time:</strong> {currentTime}
            </div>
          </div>
<div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Department</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept.departmentName}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
    <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget (KSH)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g. 10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Area of Training
            </label>
            <input
              type="text"
              value={areaOfTraining}
              onChange={(e) => setAreaOfTraining(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g. Leadership, Safety..."
            />
          </div></div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Target Group
            </label>
            <select
              multiple
              value={selectedUsers}
              onChange={(e) =>
                setSelectedUsers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-32"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} --- {user.branch} --- {user.role.name}
                </option>
              ))}
            </select>
          </div>

      

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proposed Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proposed End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
              placeholder="Additional information..."
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-1 rounded hover:bg-green-700 transition"
              onClick={SubmitData}
            >
              Submit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Page;
