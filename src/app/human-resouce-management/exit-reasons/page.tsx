
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type ExitReason = {
  reasonCode: string;
  reasonName: string;
  category: string;
  description: string;
  applicableTo: string[];
  status: string;
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

const generateReasonCode = (prefix: string = "EXIT", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [exitReason, setExitReason] = useState<ExitReason>({
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
    setExitReason(prev => ({
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
    setExitReason(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplicableToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setExitReason(prev => ({
      ...prev,
      applicableTo: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !exitReason.reasonName ||
      !exitReason.category ||
      !exitReason.applicableTo.length ||
      !exitReason.addedBy
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-exit-reason", exitReason);
      if (res.status === 201) {
        setSuccess("Exit reason created successfully.");
        setExitReason({
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
    } catch (err) {
      setError("Failed to create exit reason.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Exit Reason</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Reason Code:", name: "reasonCode", readOnly: true },
              { label: "Reason Name:", name: "reasonName", placeholder: "e.g. Resignation" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={(exitReason as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="category" className="text-sm text-black">Category:</label>
              <select
                name="category"
                value={exitReason.category}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select category</option>
                <option value="Voluntary">Voluntary</option>
                <option value="Involuntary">Involuntary</option>
                <option value="Retirement">Retirement</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="applicableTo" className="text-sm text-black">Applicable To:</label>
              <select
                multiple
                name="applicableTo"
                value={exitReason.applicableTo}
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
                value={exitReason.status}
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
                value={exitReason.description}
                onChange={handleChange}
                placeholder="Enter exit reason description..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={exitReason.addedBy}
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
                value={exitReason.remarks}
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
          ➕ Add Exit Reason
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
