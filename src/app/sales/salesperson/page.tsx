"use client";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type salesperson = {
  salesCode: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  region: string;
  country: string;
  idNumber: string;
  salesArea: string;
  salesType: string;
  branchOffice: string;
  status: string;
  employmentType: string;
  supervisor: string;
  salesTarget: number;
  salesCommission: number;
  allowDiscount: boolean;
  addedBy: string;
  remarks: string;
};

type user = {
  userName: string;
};

type salesArea = {
  code: string;
  name: string;
};

type salesType = {
  code: string;
  name: string;
};

type branchOffice = {
 branchCode: string;
  name: string;
};

type manager = {
   userName: string;
  
};

// Utility to generate unique codes
const generateUniqueCode = (prefix: string = "", length: number = 4): string => {
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const initialState: salesperson = {
    salesCode: "",
    employeeCode: "",
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    phone2: "",
    email: "",
    address: "",
    region: "",
    country: "",
    idNumber: "",
    salesArea: "",
    salesType: "",
    branchOffice: "",
    status: "Active",
    employmentType: "",
    supervisor: "",
    salesTarget: 0,
    salesCommission: 0,
    allowDiscount: false,
    addedBy: "",
    remarks: "",
  };

  const [salesperson, setSalesperson] = useState<salesperson>(initialState);
  const [usersFetched, setUsersFetched] = useState<user[]>([]);
  const [salesAreas, setSalesAreas] = useState<salesArea[]>([]);
  const [salesTypes, setSalesTypes] = useState<salesType[]>([]);
  const [branchOffices, setBranchOffices] = useState<branchOffice[]>([]);
  const [managers, setManagers] = useState<manager[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    setSalesperson((prev) => ({
      ...prev,
      salesCode: generateUniqueCode("SLP"),
      employeeCode: generateUniqueCode("EMP"),
      
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

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, areasRes, typesRes, branchesRes, managersRes] = await Promise.all([
        axios.get("/api/auth/user"),
        axios.get("/api/auth/salesarea"),
        axios.get("/api/auth/sales-category"),
        axios.get("/api/auth/addbranch"),
        axios.get("/api/auth/managers"),
      ]);

      setUsersFetched(usersRes.data);
      setSalesAreas(areasRes.data);
      setSalesTypes(typesRes.data);
      setBranchOffices(branchesRes.data);
      setManagers(managersRes.data);
    } catch (err: any) {
      setError("Failed to fetch data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const numberFields = new Set(["salesTarget", "salesCommission", "idNumber"]);

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const target = e.target;
  const { name, value, type } = target;

  if (target instanceof HTMLInputElement && type === "checkbox") {
    setSalesperson((prev) => ({
      ...prev,
      [name]: target.checked,
    }));
  } else {
    setSalesperson((prev) => ({
      ...prev,
      [name]: numberFields.has(name) ? Number(value) : value,
    }));
  }
};



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/salesperson", salesperson);
      if (res.status === 201) {
        setSuccess("Salesperson created successfully!");
        setSalesperson({
          ...initialState,
          salesCode: generateUniqueCode("SLP"),
          employeeCode: generateUniqueCode("EMP"),
         
        });
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
              { label: "Sales Code:", name: "salesCode", readOnly: true ,type:"text"},
              { label: "Employee Code:", name: "employeeCode", readOnly: true ,type:"text"},
              { label: "ID Number:", name: "idNumber", placeholder:"34444444" ,type:"text" },
              { label: "First Name:", name: "firstName", placeholder: "John" ,type:"text"},
              { label: "Last Name:", name: "lastName", placeholder: "Doe",type:"text" },
              { label: "Phone:", name: "phone", placeholder: "07XXXXXXXX" ,type:"text"},
              { label: "Phone 2:", name: "phone2", placeholder: "07XXXXXXXX" ,type:"text"},
              { label: "Email:", name: "email", placeholder: "example@email.com",type:"text" },
              { label: "Address:", name: "address", placeholder: "Nairobi" ,type:"text"},
              { label: "Region:", name: "region", placeholder: "Rift Valley" ,type:"text"},
              { label: "Country:", name: "country", placeholder: "Kenya",type:"text" },
            ].map(({ label, name, placeholder, readOnly = false,type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={(salesperson as any)[name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                  placeholder={placeholder}
                  readOnly={readOnly}
                  aria-readonly={readOnly ? "true" : undefined}
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
              <label htmlFor="salesArea" className="text-sm text-black">Sales Area:</label>
              <select
                name="salesArea"
                value={salesperson.salesArea}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select area</option>
                {salesAreas.map((area, idx) => (
                  <option key={idx} value={area.code}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="salesType" className="text-sm text-black">Sales Type:</label>
              <select
                name="salesType"
                value={salesperson.salesType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select type</option>
                {salesTypes.map((type, idx) => (
                  <option key={idx} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="branchOffice" className="text-sm text-black">Branch Office:</label>
              <select
                name="branchOffice"
                value={salesperson.branchOffice}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select branch</option>
                {branchOffices.map((office, idx) => (
                  <option key={idx} value={office.branchCode}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <select
                name="status"
                value={salesperson.status}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="employmentType" className="text-sm text-black">Employment Type reviews:</label>
              <select
                name="employmentType"
                value={salesperson.employmentType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Attachment">Attachment</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="supervisor" className="text-sm text-black">Supervisor:</label>
              <select
                name="supervisor"
                value={salesperson.supervisor}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select supervisor</option>
                {managers.map((manager, idx) => (
                  <option key={idx} value={manager.userName}>
                    {manager.userName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="salesTarget" className="text-sm text-black">Sales Target:</label>
              <input
                type="number"
                name="salesTarget"
                value={salesperson.salesTarget}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2"
                min="0"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="salesCommission" className="text-sm text-black">Commission (%):</label>
              <input
                type="number"
                name="salesCommission"
                value={salesperson.salesCommission}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="allowDiscount" className="text-sm text-black">Allow Discount:</label>
              <input
                type="checkbox"
                name="allowDiscount"
                checked={salesperson.allowDiscount}
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
<div className="flex justify-center gap-6">
        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-1 text-white rounded-md"
        >
          ➕ Add Salesperson
        </button>

          <button
        className="bg-[#E75D5D] mb-2 text-sm font-semibold px-3 py-1 text-white rounded-md"
        type="button"
        onClick={handleBack}
      >
        ❌ Back
      </button></div>
      </form>

    

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