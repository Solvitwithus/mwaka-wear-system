"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type SalesGroup = {
  groupName: string;
  groupType: string;
  description: string;
  defaultCommissionRate: number;
  allowCustomCommission: boolean;
  discountAllowed: number;
  salesTarget: string;
  isActive: boolean;
  remarks: string;
};

type SalesCategory = {
  code: string;
  name: string;
};

const initialState: SalesGroup = {
  groupName: "",
  groupType: "",
  description: "",
  defaultCommissionRate: 0,
  allowCustomCommission: false,
  discountAllowed: 0,
  salesTarget: "",
  isActive: true,
  remarks: "",
};

const Page = () => {
  const router = useRouter();
  const [salesGroup, setSalesGroup] = useState<SalesGroup>(initialState);
  const [code, setCode] = useState("");
  const [categories, setCategories] = useState<SalesCategory[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(`SG-${Math.floor(Math.random() * 100000)}`);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/auth/sales-category");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching sales categories:", err);
    }
  };

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
    type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

  setSalesGroup((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...salesGroup, code };
      const res = await axios.post("/api/auth/create-sales-group", payload);
      if (res.status === 201) {
        setSuccess("Sales Group created successfully.");
        setSalesGroup(initialState);
        setCode(`SG-${Math.floor(Math.random() * 100000)}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create Sales Group.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Sales Group</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="groupName" className="text-sm text-black">
                Group Name:
              </label>
              <input
                type="text"
                name="groupName"
                value={salesGroup.groupName}
                onChange={handleChange}
                placeholder="e.g. Distributor, Wholesaler"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="groupType" className="text-sm text-black">
                Group Type:
              </label>
              <select
                id="groupType"
                name="groupType"
                value={salesGroup.groupType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md text-sm text-[#333]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="defaultCommissionRate" className="text-sm text-black">
                Default Commission (%):
              </label>
              <input
                type="number"
                name="defaultCommissionRate"
                value={salesGroup.defaultCommissionRate}
                onChange={handleChange}
                placeholder="0.00"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="allowCustomCommission" className="text-sm text-black">
                Allow Custom Commission:
              </label>
              <input
                type="checkbox"
                id="allowCustomCommission"
                name="allowCustomCommission"
                checked={salesGroup.allowCustomCommission}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="discountAllowed" className="text-sm text-black">
                Discount Allowed (%):
              </label>
              <input
                type="number"
                name="discountAllowed"
                value={salesGroup.discountAllowed}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>
          </div>

          {/* Right Column */}
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
                value={salesGroup.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter group description"
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="salesTarget" className="text-sm text-black">
                Sales Target:
              </label>
              <input
                type="text"
                name="salesTarget"
                value={salesGroup.salesTarget}
                onChange={handleChange}
                placeholder="Monthly / Quarterly"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
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
                checked={salesGroup.isActive}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">
                Remarks:
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={salesGroup.remarks}
                onChange={handleChange}
                rows={3}
                placeholder="Optional notes..."
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Sales Group
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
