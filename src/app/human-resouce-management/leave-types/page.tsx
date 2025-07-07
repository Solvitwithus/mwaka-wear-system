
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LeaveType {
  leaveCode: string;
  leaveName: string;
  category: string;
  duration: number;
  applicableTo: string[];
  description: string;
  status: string;
  addedBy: string;
  remarks: string;
}

interface User {
  id: string;
  firstName: string;
}

interface Branch {
  branchCode: string;
  name: string;
}

const generateLeaveCode = (prefix: string = "LV", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [leaveType, setLeaveType] = useState<LeaveType>({
    leaveCode: "",
    leaveName: "",
    category: "",
    duration: 0,
    applicableTo: [],
    description: "",
    status: "Active",
    addedBy: "",
    remarks: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get<User[]>("/api/auth/user");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await axios.get<Branch[]>("/api/auth/addbranch");
      setBranches(res.data);
    } catch (err) {
      setError("Failed to fetch branches.");
    }
  }, []);

  useEffect(() => {
    setLeaveType(prev => ({
      ...prev,
      leaveCode: generateLeaveCode(),
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
    const { name, value } = e.target;
    if (name === "duration") {
      const parsedValue = parseInt(value);
      setLeaveType(prev => ({
        ...prev,
        [name]: isNaN(parsedValue) ? 0 : parsedValue,
      }));
    } else {
      setLeaveType(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleApplicableToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setLeaveType(prev => ({
      ...prev,
      applicableTo: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !leaveType.leaveName ||
      !leaveType.category ||
      leaveType.duration <= 0 ||
      !leaveType.applicableTo.length ||
      !leaveType.addedBy
    ) {
      setError("Please fill in all required fields and ensure duration is a positive number.");
      return;
    }

    // Validate leaveName length
    if (leaveType.leaveName.length < 3) {
      setError("Leave name must be at least 3 characters long.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-leave-type", leaveType);
      if (res.status === 201) {
        setSuccess("Leave type created successfully.");
        setLeaveType({
          leaveCode: generateLeaveCode(),
          leaveName: "",
          category: "",
          duration: 0,
          applicableTo: [],
          description: "",
          status: "Active",
          addedBy: "",
          remarks: "",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create leave type.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Leave Type</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Leave Code:", name: "leaveCode", readOnly: true, type: "text" },
              { label: "Leave Name:", name: "leaveName", placeholder: "e.g. Annual Leave", type: "text" },
              { label: "Duration (Days):", name: "duration", placeholder: "e.g. 21", type: "number" },
            ].map(({ label, name, placeholder, readOnly = false, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={leaveType[name as keyof LeaveType]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383] text-sm text-black"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="category" className="text-sm text-black">Category:</label>
              <select
                name="category"
                value={leaveType.category}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select category</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Special">Special</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="applicableTo" className="text-sm text-black">Applicable To:</label>
              <select
                multiple
                name="applicableTo"
                value={leaveType.applicableTo}
                onChange={handleApplicableToChange}
                className="bg-[#D9D9D9] h-20 rounded-md pl-2 text-sm text-black"
              >
                {branches.map((branch) => (
                  <option key={branch.branchCode} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <select
                name="status"
                value={leaveType.status}
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
                value={leaveType.description}
                onChange={handleChange}
                placeholder="Enter leave type description..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={leaveType.addedBy}
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
                value={leaveType.remarks}
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
          ➕ Add Leave Type
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
