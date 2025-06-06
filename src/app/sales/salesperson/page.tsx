"use client";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type salesperson= {
  salesCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  status: boolean;
  addedBy: string;
  remarks: string;
}

type user ={
  userName: string;
}

// Utility to generate unique sales code
const generateSalesCode = (prefix: string = "SLP", length: number = 4): string => {
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const initialState: salesperson = {
    salesCode: "",
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    region: "",
    status: false,
    addedBy: "",
    remarks: "",
  };

  const [salesperson, setSalesperson] = useState<salesperson>(initialState);
  const [usersFetched, setUsersFetched] = useState<user[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    setSalesperson((prev) => ({
      ...prev,
      salesCode: generateSalesCode(),
    }));
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/user");
      setUsersFetched(res.data);
    } catch (err: any) {
      setError("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      setSalesperson((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setSalesperson((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/salesperson", salesperson);
      if (res.status === 201) {
        setSuccess("Salesperson created successfully!");
        setSalesperson(initialState);
        setSalesperson((prev) => ({
          ...prev,
          salesCode: generateSalesCode(),
        }));
      }
    } catch (err: any) {
      setError("Failed to create salesperson.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Salesperson</h4>
      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Sales Code:", name: "salesCode", readOnly: true },
              { label: "First Name:", name: "firstName", placeholder: "John" },
              { label: "Last Name:", name: "lastName", placeholder: "Doe" },
              { label: "Phone:", name: "phone", placeholder: "07XXXXXXXX" },
              { label: "Email:", name: "email", placeholder: "example@email.com" },
              { label: "Address:", name: "address", placeholder: "Nairobi" },
              { label: "Region:", name: "region", placeholder: "Rift Valley" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(salesperson as any)[name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                  placeholder={placeholder}
                  readOnly={readOnly}
                  aria-readonly={readOnly}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="gender" className="text-sm text-black">Gender:</label>
              <select
                name="gender"
                value={salesperson.gender}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={salesperson.status}
                onChange={handleChange}
                className="h-6"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={salesperson.addedBy}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select user</option>
                {usersFetched.map((user, idx) => (
                  <option key={idx} value={user.userName}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={salesperson.remarks}
                onChange={handleChange}
                cols={30}
                rows={6}
                className="bg-[#D9D9D9] rounded-md pl-2 placeholder-[#e48383] text-sm"
                placeholder="Enter any remarks..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Salesperson
        </button>
      </form>

      <button
        className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md"
        type="button"
        onClick={handleBack}
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
