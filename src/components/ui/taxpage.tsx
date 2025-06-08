"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Tax = {
  name: string;
  code: string;
  description: string;
  chargeType: "Fixed" | "Percentage";
  lowerLimit: number;
  upperLimit: number;
  rate: number;
  fixedAmount: number;
  reliefApplicable: boolean;
  effectiveFrom: string;
  branch: string;
  creator: string;
  status: "Active" | "Inactive";
  
};

type Branch = {
  branchCode: string;
  name: string;
};

type User = {
  userName: string;
};

const generateCode = (): string => {
  const chars = "TAX0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const initialState: Tax = {
  name: "",
  code: generateCode(),
  description: "",
  chargeType: "Percentage",
  lowerLimit: 0,
  upperLimit: 0,
  rate: 0,
  fixedAmount: 0,
  reliefApplicable: false,
  effectiveFrom: "",
  branch: "",
  creator: "",
  status: "Active",
};

const Taxationpage = () => {
  const router = useRouter();
  const [tax, setTax] = useState<Tax>(initialState);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, userRes] = await Promise.all([
          axios.get("/api/auth/addbranch"),
          axios.get("/api/auth/user"),
        ]);
        setBranches(branchRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : type === "number"
      ? parseFloat(value)
      : value;

    setTax((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("tax",tax);
    
    try {
      const res = await axios.post("/api/auth/create-tax", tax);
      if (res.status === 201) {
        setSuccess("Tax created successfully.");
        setTax({ ...initialState, code: generateCode() });
      }
    } catch (err) {
      setError("Failed to create tax.");
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
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Tax Setup</h4>
      <form onSubmit={handleSubmit} className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto">
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Side */}
          <div className="flex flex-col">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "e.g. PAYE" },
              { label: "Code", name: "code", type: "text", readOnly: true },
              { label: "Lower Limit", name: "lowerLimit", type: "number" },
              { label: "Upper Limit", name: "upperLimit", type: "number" },
              { label: "Rate (%)", name: "rate", type: "number" },
              { label: "Fixed Amount", name: "fixedAmount", type: "number" },
            ].map((field) => (
              <div key={field.name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={field.name} className="text-sm text-black">{field.label}:</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  value={(tax as any)[field.name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">Description:</label>
              <textarea
                name="description"
                id="description"
                value={tax.description}
                onChange={handleChange}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="reliefApplicable" className="text-sm text-black">Relief Applicable:</label>
              <input
                type="checkbox"
                name="reliefApplicable"
                id="reliefApplicable"
                checked={tax.reliefApplicable}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="chargeType" className="text-sm text-black">Charge Type:</label>
              <select
                name="chargeType"
                value={tax.chargeType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="effectiveFrom" className="text-sm text-black">Effective From:</label>
              <input
                type="date"
                name="effectiveFrom"
                value={tax.effectiveFrom}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              />
            </div>

            {[ 
              { label: "Branch", name: "branch", options: branches.map(b => ({ label: b.name, value: b.branchCode })) },
              { label: "Creator", name: "creator", options: users.map(u => ({ label: u.userName, value: u.userName })) },
              { label: "Status", name: "status", options: ["Active", "Inactive"].map(s => ({ label: s, value: s })) },
            ].map((field) => (
              <div key={field.name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={field.name} className="text-sm text-black">{field.label}:</label>
                <select
                  name={field.name}
                  id={field.name}
                  value={(tax as any)[field.name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Tax
        </button>
      </form>

      <button
        className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md"
        type="button"
        onClick={() => router.back()}
      >
        ❌ Back
      </button>

      {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
      {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
    </div>
  );
};

export default Taxationpage;

