"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type CreditStatus = {
  statusName: string;
  description: string;
  category: string;
  defaultStatus: boolean;
  isFinalStatus: boolean;
  isActive: boolean;
  remarks: string;
};

const initialState: CreditStatus = {
  statusName: "",
  description: "",
  category: "Positive",
  defaultStatus: false,
  isFinalStatus: false,
  isActive: true,
  remarks: "",
};

const Page = () => {
  const router = useRouter();
  const [creditStatus, setCreditStatus] = useState<CreditStatus>(initialState);
  const [code, setCode] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const randomCode = `CREDIT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCode(randomCode);
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

  const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  const newValue =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;

  setCreditStatus((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...creditStatus, code };
     
      
      const res = await axios.post("/api/auth/create-credit-status", payload);
      if (res.status === 201) {
        setSuccess("Credit Status created successfully.");
        setCreditStatus(initialState);
        const newCode = `CREDIT-${Math.floor(1000 + Math.random() * 9000)}`;
        setCode(newCode);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create credit status.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Credit Status</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="statusName" className="text-sm text-black">
                Status Name:
              </label>
              <input
                type="text"
                name="statusName"
                id="statusName"
                value={creditStatus.statusName}
                onChange={handleChange}
                placeholder="e.g. Paid, Pending"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="category" className="text-sm text-black">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={creditStatus.category}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="defaultStatus" className="text-sm text-black">
                Default Status:
              </label>
              <input
                type="checkbox"
                id="defaultStatus"
                name="defaultStatus"
                checked={creditStatus.defaultStatus}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isFinalStatus" className="text-sm text-black">
                Final Status:
              </label>
              <input
                type="checkbox"
                id="isFinalStatus"
                name="isFinalStatus"
                checked={creditStatus.isFinalStatus}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isActive" className="text-sm text-black">
                Is Active:
              </label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={creditStatus.isActive}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="code" className="text-sm text-black">
                Code:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                disabled
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-[#e48383] cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={creditStatus.description}
                onChange={handleChange}
                placeholder="Describe the status meaning"
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">
                Remarks:
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={creditStatus.remarks}
                onChange={handleChange}
                placeholder="Any remarks..."
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Credit Status
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
