"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Branch = {
  branchCode: string;
  name: string;
  region: string;
  town: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: boolean;
  cycleDuration: string;
  remarks: string;
  addedBy: string;
};

type User = {
  userName: string;
};


const generateBranchCode = (prefix: string = "BR", length: number = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [branch, setBranch] = useState<Branch>({
    branchCode: "",
    name: "",
    region: "",
    town: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    status: false,
    cycleDuration: "",
    remarks: "",
    addedBy: "",
  });

  const [usersFetched, setUsersFetched] = useState<User[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
const [managers, setManagers] = useState<{ firstName: string; lastName: string; userName: string }[]>([]);
const fetchManagers = useCallback(async () => {
  try {
    const res = await axios.get("/api/auth/managers");
    setManagers(res.data); // Assuming res.data is an array of manager objects
  } catch (err) {
    console.error("Failed to fetch managers:", err);
  }
},[]);


  useEffect(() => {
    setBranch(prev => ({
      ...prev,
      branchCode: generateBranchCode(),
    }));
   
  }, []);
useEffect(() => {
  fetchManagers();
}, [fetchManagers]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/auth/user");
        setUsersFetched(res.data);
      } catch {
        setError("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setBranch(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setBranch(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/addbranch", branch);
      if (res.status === 201) {
        setSuccess("Branch created successfully.");
        setBranch({
          branchCode: generateBranchCode(),
          name: "",
          region: "",
          town: "",
          address: "",
          phone: "",
          email: "",
          manager: "",
          status: false,
          cycleDuration: "",
          remarks: "",
          addedBy: "",
        });
      }
    } catch {
      setError("Failed to create branch.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Branch</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Branch Code:", name: "branchCode", readOnly: true },
              { label: "Branch Name:", name: "name", placeholder: "e.g. Westlands Branch" },
              { label: "Region:", name: "region", placeholder: "e.g. Central" },
              { label: "Town:", name: "town", placeholder: "e.g. Nairobi" },
              { label: "Address:", name: "address", placeholder: "e.g. Moi Avenue" },
              { label: "Phone:", name: "phone", placeholder: "e.g. 0712345678" },
              { label: "Email:", name: "email", placeholder: "e.g. branch@example.com" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={(branch as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
           <div className="flex justify-end gap-2 mb-1">
  <label htmlFor="manager" className="text-sm text-black">Manager:</label>
  <select
    name="manager"
    value={branch.manager}
    onChange={handleChange}
    className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
  >
    <option value="">Select manager</option>
    {managers.map((manager, idx) => (
      <option key={idx} value={manager.userName}>
        {manager.firstName} {manager.lastName}
      </option>
    ))}
  </select>
</div>


            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="cycleDuration" className="text-sm text-black">Cycle Duration:</label>
              <input
                type="text"
                name="cycleDuration"
                value={branch.cycleDuration}
                onChange={handleChange}
                placeholder="e.g. 3 months"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={branch.status}
                onChange={handleChange}
                className="h-6"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={branch.addedBy}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select user</option>
                {usersFetched.map((user, idx) => (
                  <option key={idx} value={user.userName}>{user.userName}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={branch.remarks}
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
          ➕ Add Branch
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
