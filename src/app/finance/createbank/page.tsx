"use client";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type bankie = {
  bankName: string;
  bankCode: string;
  branchName: string;
  branchCode: string;
  BICCode: string;
  headOfficeAddress: string;
  country: string;
  email: string;
  phone1: string;
  phone2: string;
  website: string;
  status: boolean;
  addedBy: string;
  bankType: string;
  remarks: string;
};

interface user {
  firstName: string;
  lastName: string;
  userName: string;
  shortName: string;
  address: string;
  email: string;
  password: string;
  roleId: string;
  branch: string;
  phone1: string;
  phone2: string;
  description: string;
}

// Utility to generate unique code
const generateUniqueCode = (prefix: string = "", length: number = 4): string => {
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const initialState: bankie = {
    bankName: "",
    bankCode: "",
    branchName: "",
    branchCode: "",
    BICCode: "",
    headOfficeAddress: "",
    country: "",
    email: "",
    phone1: "",
    phone2: "",
    website: "",
    status: false,
    addedBy: "",
    bankType: "",
    remarks: "",
  };

  const [bank, setBank] = useState<bankie>(initialState);
  const [success, setSuccess] = useState<string>("");
const [error, setError] = useState<string>("");

useEffect(() => {
  if (success || error) {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [success, error]);

  const [usersFetched, setUsersFetched] = useState<user[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      const { checked } = e.target;
      setBank((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setBank((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchExistingUsers = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/user", {
        headers: { "Content-Type": "application/json" },
      });

      setUsersFetched(response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to fetch Users!");
      } else {
        setError(`Error fetching: ${error.message}`);
      }
    }
  }, []);

  useEffect(() => {
    fetchExistingUsers();
    setBank((prev) => ({
      ...prev,
      bankCode: generateUniqueCode("BNK"),
      branchCode: generateUniqueCode("BRN"),
    }));
  }, []);
const handleBankreation = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();



  try {
    const res = await axios.post("/api/auth/bankname", bank, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 201) {
      setSuccess("Bank created successfully!");
      setBank(initialState); // Reset the form if needed
    }
  } catch (err: any) {
    setError(err.response?.data?.error || "Failed to create bank!");
  }
};


  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Bank</h4>
      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleBankreation}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Bank Code:", name: "bankCode", readOnly: true },
              { label: "Bank Name:", name: "bankName", placeholder: "Equity" },
              { label: "Branch Name:", name: "branchName", placeholder: "Equity Rongai" },
              { label: "Branch Code:", name: "branchCode", readOnly: true },
              { label: "SWIFT/BIC Code:", name: "BICCode", placeholder: "EQBLKENA" },
              { label: "Head Office Address:", name: "headOfficeAddress", placeholder: "Nairobi, Kenya" },
              { label: "Country:", name: "country", placeholder: "Kenya" },
              { label: "Email:", name: "email", placeholder: "bank@info.com" },
              { label: "Phone 1:", name: "phone1", placeholder: "0765456770" },
              { label: "Phone 2:", name: "phone2", placeholder: "0765456778" },
              { label: "Website:", name: "website", placeholder: "www.bankname.com" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(bank as any)[name]}
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
              <label htmlFor="status" className="text-sm text-black">
                Status:
              </label>
              <input
                type="checkbox"
                name="status"
                checked={bank.status}
                onChange={handleChange}
                className="h-6"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">
                Added By:
              </label>
              <select
                name="addedBy"
                value={bank.addedBy}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Who added this</option>
                {usersFetched.map((user, idx) => (
                  <option key={idx} value={user.userName}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="bankType" className="text-sm text-black">
                Bank Type:
              </label>
              <select
                name="bankType"
                value={bank.bankType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select bank type</option>
                <option value="Commercial">Commercial</option>
                <option value="MicroFinance">MicroFinance</option>
                <option value="Sacco">Sacco</option>
                <option value="DigitalOnly">Digital Only</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">
                Remarks:
              </label>
              <textarea
                name="remarks"
                value={bank.remarks}
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
          ➕ Add Bank
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
