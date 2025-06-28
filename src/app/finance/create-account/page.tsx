"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const generateSalesCode = (prefix: string = "CLT", length: number = 4): string => {
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
};
const initialState = {
  bankName: "",
  accountCode: generateSalesCode (),
  accountName: "",
  accountNumber: "",
  accountType: "Current",
  currency: "",
  isPrimaryAccount: false,
  usedForPayroll: false,
  branchCode: "",
  departmentName: "",
  allowOverdraft: false,
  overdraftLimit: 0,
  reconciliationEnabled: false,
  openingBalance: 0,
  accountStatus: "Active",
  notes: "",
  effectiveFrom: "",
};

const Page = () => {
  const router = useRouter();
  const [account, setAccount] = useState(initialState);
  const [banks, setBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/auth/bankname"),
      axios.get("/api/auth/currency"),
      axios.get("/api/auth/addbranch"),
      axios.get("/api/auth/create-department"),
    ])
      .then(([bankRes, currencyRes, branchRes, departmentRes]) => {
        setBanks(bankRes.data);
        setCurrencies(currencyRes.data);
        setBranches(branchRes.data);
        setDepartments(departmentRes.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
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
  const { name, value, type } = e.target as HTMLInputElement;

  setAccount((prev) => ({
    ...prev,
    [name]: type === "checkbox"
      ? (e.target as HTMLInputElement).checked // safe cast
      : value,
  }));
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/create-bank-account", account);
      if (res.status === 201) {
        setSuccess("Bank account created successfully.");
        setAccount(initialState);
        
        
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create bank account.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Bank Account</h4>

      <form onSubmit={handleSubmit} className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto">
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          <div className="flex flex-col">
            {/* Left Column */}
             <div className="flex justify-end gap-2 mb-1">
            <label>Bank:</label>
            <select name="bankName" value={account.bankName} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              <option value="">-- Select Bank --</option>
              {banks.map((bank: any) => (
                <option key={bank.bankCode} value={bank.bankName}>{bank.bankName}</option>
              ))}
            </select>
            </div>
              <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="code" className="text-sm text-black">
                Account Code:
              </label>
              <input
                type="text"
                id="accountCode"
                value={account.accountCode}
                disabled
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-[#e48383] cursor-not-allowed"
              />
            </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Account Name:</label>
            <input type="text" name="accountName" value={account.accountName} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2" />
 </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Account Number:</label>
            <input type="text" name="accountNumber" value={account.accountNumber} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2" />
 </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Account Type:</label>
            <select name="accountType" value={account.accountType} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              {["Current", "Savings", "Fixed Deposit", "Petty Cash", "Mobile Money"].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Currency:</label>
            <select name="currency" value={account.currency} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              <option value="">-- Select Currency --</option>
              {currencies.map((cur: any) => (
                <option key={cur.currencyCode} value={cur.currencyCode}>{cur.currencyName} ({cur.currencySymbol})</option>
              ))}
            </select>
            </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Branch:</label>
            <select name="branchCode" value={account.branchCode} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              <option value="">-- Select Branch --</option>
              {branches.map((b: any) => (
                <option key={b.branchCode} value={b.branchCode}>{b.name}</option>
              ))}
            </select>
            </div>
 <div className="flex justify-end gap-2 mb-1">
            <label>Department:</label>
            <select name="departmentName" value={account.departmentName} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              <option value="">-- Select Department --</option>
              {departments.map((d: any) => (
                <option key={d.departmentName} value={d. departmentName}>{d. departmentName}</option>
              ))}
            </select>
        </div>
          </div>

          <div className="flex flex-col">
            {/* Right Column */}
            <label><input type="checkbox" name="isPrimaryAccount" checked={account.isPrimaryAccount} onChange={handleChange} /> Is Primary Account</label>
            <label><input type="checkbox" name="usedForPayroll" checked={account.usedForPayroll} onChange={handleChange} /> Used for Payroll</label>
            <label><input type="checkbox" name="allowOverdraft" checked={account.allowOverdraft} onChange={handleChange} /> Allow Overdraft</label>

            <label>Overdraft Limit:</label>
            <input type="number" name="overdraftLimit" value={account.overdraftLimit} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2" />

            <label><input type="checkbox" name="reconciliationEnabled" checked={account.reconciliationEnabled} onChange={handleChange} /> Reconciliation Enabled</label>

            <label>Opening Balance:</label>
            <input type="number" name="openingBalance" value={account.openingBalance} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2" />

            <label>Account Status:</label>
            <select name="accountStatus" value={account.accountStatus} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2">
              {["Active", "Inactive", "Suspended", "Closed"].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <label>Effective From:</label>
            <input type="date" name="effectiveFrom" value={account.effectiveFrom} onChange={handleChange} className="bg-[#D9D9D9] h-6 rounded-md mb-2" />

            <label>Notes:</label>
            <textarea name="notes" value={account.notes} onChange={handleChange} rows={3} className="bg-[#D9D9D9] rounded-md mb-2" />
          </div>
        </div>

        <button type="submit" className="bg-[#4E803F] text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md mb-2">➕ Create Account</button>
      </form>

      <button onClick={() => router.back()} className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md">❌ Back</button>

      {success && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md z-10">{success}</div>}
      {error && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">{error}</div>}
    </div>
  );
};

export default Page;