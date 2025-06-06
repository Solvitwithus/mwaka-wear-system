"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type SalesArea = {
  code: string;
  name: string;
  region: string;
  county: string;
  zone: string;
  headquarters: string;
  areaManager: string;
  phone: string;
  email: string;
  status: boolean;
  remarks: string;
};

type Manager = {
  userName: string;
  firstName: string;
  lastName: string;
};

const generateSalesAreaCode = (prefix = "SA", length = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

const SalesAreaPage = () => {
  const router = useRouter();

  const [salesArea, setSalesArea] = useState<SalesArea>({
    code: "",
    name: "",
    region: "",
    county: "",
    zone: "",
    headquarters: "",
    areaManager: "",
    phone: "",
    email: "",
    status: true,
    remarks: "",
  });

  const [managers, setManagers] = useState<Manager[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchManagers = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/managers");
      setManagers(res.data);
    } catch (err) {
      console.error("Failed to fetch managers:", err);
    }
  }, []);

  useEffect(() => {
    setSalesArea(prev => ({
      ...prev,
      code: generateSalesAreaCode(),
    }));
    fetchManagers();
  }, [fetchManagers]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSalesArea(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setSalesArea(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/salesarea", salesArea);
      if (res.status === 201) {
        setSuccess("✅ Sales area created successfully.");
        setSalesArea({
          code: generateSalesAreaCode(),
          name: "",
          region: "",
          county: "",
          zone: "",
          headquarters: "",
          areaManager: "",
          phone: "",
          email: "",
          status: true,
          remarks: "",
        });
      }
    } catch {
      setError("❌ Failed to create sales area.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#265b3a]">Create Sales Area</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Sales Area Code:", name: "code", readOnly: true },
              { label: "Sales Area Name:", name: "name", placeholder: "e.g. Nairobi Urban" },
              { label: "Region:", name: "region", placeholder: "e.g. Central" },
              { label: "County:", name: "county", placeholder: "e.g. Nairobi" },
              { label: "Zone:", name: "zone", placeholder: "e.g. Eastlands" },
              { label: "Headquarters:", name: "headquarters", placeholder: "e.g. Moi Avenue" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={(salesArea as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#4c5955]"
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="areaManager" className="text-sm text-black">Area Manager:</label>
              <select
                name="areaManager"
                value={salesArea.areaManager}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Manager</option>
                {managers.map((manager, idx) => (
                  <option key={idx} value={manager.userName}>
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="phone" className="text-sm text-black">Phone:</label>
              <input
                type="text"
                name="phone"
                value={salesArea.phone}
                onChange={handleChange}
                placeholder="e.g. 0712345678"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#4c5955]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="email" className="text-sm text-black">Email:</label>
              <input
                type="email"
                name="email"
                value={salesArea.email}
                onChange={handleChange}
                placeholder="e.g. sales@example.com"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#4c5955]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={salesArea.status}
                onChange={handleChange}
                className="h-6"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={salesArea.remarks}
                onChange={handleChange}
                placeholder="Enter any remarks..."
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#4c5955]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Sales Area
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
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default SalesAreaPage;
