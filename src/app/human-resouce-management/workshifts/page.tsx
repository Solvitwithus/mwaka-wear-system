
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Shift = {
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  days: string[];
  assignedEmployees: string[];
  branch: string;
  status: string;
  description: string;
  addedBy: string;
  remarks: string;
};

type User = {
  id: string;
  firstName: string;
};

type Branch = {
  branchCode: string;
  name: string;
};

const generateShiftCode = (prefix: string = "SH", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [shift, setShift] = useState<Shift>({
    shiftCode: "",
    shiftName: "",
    startTime: "",
    endTime: "",
    days: [],
    assignedEmployees: [],
    branch: "",
    status: "Active",
    description: "",
    addedBy: "",
    remarks: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/user");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/addbranch");
      setBranches(res.data);
    } catch (err) {
      setError("Failed to fetch branches.");
    }
  }, []);

  useEffect(() => {
    setShift(prev => ({
      ...prev,
      shiftCode: generateShiftCode(),
    }));
    fetchUsers();
    fetchBranches();
  }, [fetchUsers, fetchBranches]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setShift(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setShift(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDaysChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setShift(prev => ({
      ...prev,
      days: selected,
    }));
  };

  const handleAssignedEmployeesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setShift(prev => ({
      ...prev,
      assignedEmployees: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !shift.shiftName ||
      !shift.startTime ||
      !shift.endTime ||
      !shift.days.length ||
      !shift.assignedEmployees.length ||
      !shift.branch ||
      !shift.addedBy
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(shift.startTime) || !timeRegex.test(shift.endTime)) {
      setError("Start and end times must be in HH:mm format (e.g., 08:00).");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-shift", shift);
      if (res.status === 201) {
        setSuccess("Shift created successfully.");
        setShift({
          shiftCode: generateShiftCode(),
          shiftName: "",
          startTime: "",
          endTime: "",
          days: [],
          assignedEmployees: [],
          branch: "",
          status: "Active",
          description: "",
          addedBy: "",
          remarks: "",
        });
      }
    } catch (err) {
      setError("Failed to create shift.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Work Shift</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Shift Code:", name: "shiftCode", readOnly: true },
              { label: "Shift Name:", name: "shiftName", placeholder: "e.g. Morning Shift" },
              { label: "Start Time:", name: "startTime", type: "time", placeholder: "e.g. 08:00" },
              { label: "End Time:", name: "endTime", type: "time", placeholder: "e.g. 16:00" },
            ].map(({ label, name, placeholder, readOnly = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(shift as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="days" className="text-sm text-black">Days:</label>
              <select
                multiple
                name="days"
                value={shift.days}
                onChange={handleDaysChange}
                className="bg-[#D9D9D9] h-20 rounded-md pl-2 text-sm text-black"
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="assignedEmployees" className="text-sm text-black">Assigned Employees:</label>
              <select
                multiple
                name="assignedEmployees"
                value={shift.assignedEmployees}
                onChange={handleAssignedEmployeesChange}
                className="bg-[#D9D9D9] h-20 rounded-md pl-2 text-sm text-black"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="branch" className="text-sm text-black">Branch:</label>
              <select
                name="branch"
                value={shift.branch}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.branchCode} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <select
                name="status"
                value={shift.status}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">Description:</label>
              <textarea
                name="description"
                value={shift.description}
                onChange={handleChange}
                placeholder="Enter shift description..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={shift.addedBy}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={shift.remarks}
                onChange={handleChange}
                placeholder="Enter any remarks..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Shift
        </button>
      </form>

      <button
        className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md"
        type="button"
        onClick={() => router.back()}
      >
        ❌ Back
      </button>

      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default Page;
