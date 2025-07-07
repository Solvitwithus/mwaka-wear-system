
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ContractType {
  contractCode: string;
  contractName: string;
  category: string;
  duration: number | null;
  description: string;
  status: string;
  addedBy: string;
  remarks: string;
}

interface User {
  id: string;
  firstName: string;
}

const generateContractCode = (prefix: string = "CT", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [contractType, setContractType] = useState<ContractType>({
    contractCode: "",
    contractName: "",
    category: "",
    duration: null,
    description: "",
    status: "Active",
    addedBy: "",
    remarks: "",
  });

  const [users, setUsers] = useState<User[]>([]);
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

  useEffect(() => {
    setContractType(prev => ({
      ...prev,
      contractCode: generateContractCode(),
    }));
    fetchUsers();
  }, [fetchUsers]);

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
      setContractType(prev => ({
        ...prev,
        [name]: isNaN(parsedValue) ? null : parsedValue,
      }));
    } else {
      setContractType(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !contractType.contractName ||
      !contractType.category ||
      !contractType.addedBy
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate contractName length
    if (contractType.contractName.length < 3) {
      setError("Contract name must be at least 3 characters long.");
      return;
    }

    // Validate duration if provided
    if (contractType.duration !== null && contractType.duration <= 0) {
      setError("Duration must be a positive number if provided.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-contract-type", contractType);
      if (res.status === 201) {
        setSuccess("Contract type created successfully.");
        setContractType({
          contractCode: generateContractCode(),
          contractName: "",
          category: "",
          duration: null,
          description: "",
          status: "Active",
          addedBy: "",
          remarks: "",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create contract type.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Contract Type</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Contract Code:", name: "contractCode", readOnly: true, type: "text" },
              { label: "Contract Name:", name: "contractName", placeholder: "e.g. Permanent", type: "text" },
              { label: "Duration (Months):", name: "duration", placeholder: "e.g. 12", type: "number" },
            ].map(({ label, name, placeholder, readOnly = false, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={contractType[name as keyof ContractType] ?? ""}
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
                value={contractType.category}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select category</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Temporary">Temporary</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <select
                name="status"
                value={contractType.status}
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
                value={contractType.description}
                onChange={handleChange}
                placeholder="Enter contract type description..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={contractType.addedBy}
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
                value={contractType.remarks}
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
          ➕ Add Contract Type
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
