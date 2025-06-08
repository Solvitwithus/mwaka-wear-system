"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type drive ={
      userName: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    licenseNumber: string,
     licenseIssueDate: string;
  dateOfBirth: string;
    address: string,
    remarks: string,
}

const initialState = {
    userName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    licenseNumber: "",
    licenseIssueDate: "",
    dateOfBirth: "",
    address: "",
    remarks: "",
  }
const Page = () => {
     const router = useRouter();
  const [driver, setDriver] = useState<drive>(initialState);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDriver((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/adddriver", driver);
      if (res.status === 201) {
        setSuccess("Driver added successfully.");
        setDriver(initialState);
      }
    } catch (err) {
      setError("Failed to add driver.");
      console.error(err);
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Driver</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {[
              {
                label: "Username:",
                name: "userName",
                placeholder: "Unique username",
                type: "text",
              },
              {
                label: "First Name:",
                name: "firstName",
                placeholder: "Driver's first name",
                type: "text",
              },
              {
                label: "Last Name:",
                name: "lastName",
                placeholder: "Driver's last name",
                type: "text",
              },
              {
                label: "Phone Number:",
                name: "phoneNumber",
                placeholder: "e.g. +254712345678",
                type: "tel",
              },
              {
                label: "Email:",
                name: "email",
                placeholder: "driver@example.com",
                type: "email",
              },
            ].map(({ label, name, placeholder, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(driver as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            {/* Address */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="address" className="text-sm text-black">
                Address:
              </label>
              <textarea
                id="address"
                name="address"
                value={driver.address}
                onChange={handleChange}
                placeholder="Driver's address"
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {[
              {
                label: "License Number:",
                name: "licenseNumber",
                placeholder: "Driver's license number",
                type: "text",
              },
              {
                label: "License Issue Date:",
                name: "licenseIssueDate",
                placeholder: "",
                type: "date",
              },
              {
                label: "Date of Birth:",
                name: "dateOfBirth",
                placeholder: "",
                type: "date",
              },
            ].map(({ label, name, placeholder, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(driver as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            {/* Remarks */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">
                Remarks:
              </label>
              <textarea
                name="remarks"
                id="remarks"
                value={driver.remarks}
                onChange={handleChange}
                placeholder="Additional notes"
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
          ➕ Add Driver
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

export default Page;
