
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface NonAttendanceReason {
  reasonCode: string;
  reasonName: string;
  category: string;
  description: string;
  applicableTo: string[];
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

const generateReasonCode = (prefix: string = "NAR", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [nonAttendanceReason, setNonAttendanceReason] = useState<NonAttendanceReason>({
    reasonCode: "",
    reasonName: "",
    category: "",
    description: "",
    applicableTo: [],
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
    setNonAttendanceReason(prev => ({
      ...prev,
      reasonCode: generateReasonCode(),
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
    setNonAttendanceReason(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplicableToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setNonAttendanceReason(prev => ({
      ...prev,
      applicableTo: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !nonAttendanceReason.reasonName ||
      !nonAttendanceReason.category ||
      !nonAttendanceReason.addedBy
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate reasonName length
    if (nonAttendanceReason.reasonName.length < 3) {
      setError("Reason name must be at least 3 characters long.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-non-attendance-reason", nonAttendanceReason);
      if (res.status === 201) {
        setSuccess("Non-attendance reason created successfully.");
        setNonAttendanceReason({
          reasonCode: generateReasonCode(),
          reasonName: "",
          category: "",
          description: "",
          applicableTo: [],
          status: "Active",
          addedBy: "",
          remarks: "",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create non-attendance reason.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Non-Attendance Reason</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Reason Code:", name: "reasonCode", readOnly: true, type: "text" },
              { label: "Reason Name:", name: "reasonName", placeholder: "e.g. Sick Leave", type: "text" },
            ].map(({ label, name, placeholder, readOnly = false, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={nonAttendanceReason[name as keyof NonAttendanceReason]}
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
                value={nonAttendanceReason.category}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select category</option>
                <option value="Medical">Medical</option>
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="applicableTo" className="text-sm text-black">Applicable To (Optional):</label>
              <select
                multiple
                name="applicableTo"
                value={nonAttendanceReason.applicableTo}
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
                value={nonAttendanceReason.status}
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
                value={nonAttendanceReason.description}
                onChange={handleChange}
                placeholder="Enter non-attendance reason description..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={nonAttendanceReason.addedBy}
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
                value={nonAttendanceReason.remarks}
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
          ➕ Add Non-Attendance Reason
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
