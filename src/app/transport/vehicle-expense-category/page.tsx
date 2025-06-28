"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type ExpenseCategory = {
  name: string;
  code: string;
  description: string;
  expenseAccount: string;
  tag: string;
  isRecurring: boolean;
  appliesToAllVehicles: boolean;
  amount: string;
  effectiveFrom: string;
  isActive: boolean;
  remarks: string;
};

type BankAccount = {
  accountName: string;
  accountNumber: string;
};

const initialState: ExpenseCategory = {
  name: "",
  code: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
  description: "",
  expenseAccount: "",
  tag: "",
  isRecurring: false,
  appliesToAllVehicles: false,
  amount: "",
  effectiveFrom: "",
  isActive: true,
  remarks: "",
};

const tags = ["Routine", "Urgent", "Annual", "Engine"];

const Page = () => {
  const router = useRouter();
  const [expense, setExpense] = useState<ExpenseCategory>(initialState);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  const newValue =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;

  setExpense((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    
    try {
      const res = await axios.post("/api/auth/create-vehicle-expense-category", expense);
      if (res.status === 201) {
        setSuccess("Vehicle expense category created.");
        setExpense({ ...initialState, code: `EXP-${Math.floor(1000 + Math.random() * 9000)}` });
      }
    } catch (err) {
      setError("Failed to create vehicle expense category.");
      console.error(err);
    }
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/create-bank-account");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Vehicle Expense Category</h4>

      <form onSubmit={handleSubmit} className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto">
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Name:", name: "name", placeholder: "e.g. Oil Change", type: "text" },
              { label: "Code (Auto):", name: "code", placeholder: "", type: "text", readOnly: true },
              { label: "Amount:", name: "amount", placeholder: "e.g. 5000", type: "number" },
              { label: "Effective From:", name: "effectiveFrom", type: "date" },
            ].map(({ label, name, placeholder, type, readOnly }) => (
              <div key={name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  placeholder={placeholder}
                  value={(expense as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            {/* Expense Account */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="expenseAccount" className="text-sm text-black">Expense Account:</label>
              <select
                name="expenseAccount"
                value={expense.expenseAccount}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option
                    key={acc.accountNumber}
                    value={acc.accountName}
                  >{`${acc.accountName} - ${acc.accountNumber}`}</option>
                ))}
              </select>
            </div>

            {/* Tag Dropdown */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="tag" className="text-sm text-black">Tag:</label>
              <select
                name="tag"
                value={expense.tag}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Tag</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Checkboxes */}
            {[
              { label: "Is Recurring:", name: "isRecurring" },
              { label: "Applies to All Vehicles:", name: "appliesToAllVehicles" },
              { label: "Is Active:", name: "isActive" },
            ].map(({ label, name }) => (
              <div key={name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="checkbox"
                  name={name}
                  checked={(expense as any)[name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Description */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">Description:</label>
              <textarea
                name="description"
                value={expense.description}
                onChange={handleChange}
                placeholder="Describe the expense category"
                rows={2}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            {/* Remarks */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={expense.remarks}
                onChange={handleChange}
                placeholder="Any remarks"
                rows={2}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Expense Category
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

export default Page;
