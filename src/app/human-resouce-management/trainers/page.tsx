
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { min } from "date-fns";

type Trainer = {
  nationalId: string;
  fullName: string;
  email: string;
  phone1: string;
  phone2: string;
  website: string;
  gender: string;
  specialization: string;
  credentials: string[];
  experienceYears: number;
  languages: string[];
  trainerType: string;
  availability: string;
  ratePerSession: number;
  city: string;
  country: string;
  preferredMode: string;
  canTravel: boolean;
  workingZones: string[];
  contractStartDate: string;
  contractEndDate: string;
  status: string;
  trainerProfile: string;
  remarks: string;
  portfolioLinks: string[];
  addedBy: string;
};

type User = {
  id: string;
  firstName: string;
};

type Branch = {
  branchCode: string;
  name: string;
};

const generateNationalId = (): string => {
  const min = 10000000; // 8 digits
  const max = 99999999;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

const Page = () => {
  const router = useRouter();

  const [trainer, setTrainer] = useState<Trainer>({
    nationalId: "",
    fullName: "",
    email: "",
    phone1: "",
    phone2: "",
    website: "",
    gender: "",
    specialization: "",
    credentials: [],
    experienceYears: 0,
    languages: [],
    trainerType: "",
    availability: "",
    ratePerSession: 0,
    city: "",
    country: "",
    preferredMode: "",
    canTravel: false,
    workingZones: [],
    contractStartDate: "",
    contractEndDate: "",
    status: "Active",
    trainerProfile: "",
    remarks: "",
    portfolioLinks: [],
    addedBy: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/user");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/addbranch");
      setBranches(res.data);
    } catch (err) {
      setError("Failed to fetch branches.");
    }
  }, []);

  useEffect(() => {
    setTrainer(prev => ({
      ...prev,
      nationalId: generateNationalId(),
    }));
    fetchUsers();
    fetchBranches();
  }, [fetchUsers, fetchBranches]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setTrainer(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "credentials" || name === "languages" || name === "portfolioLinks") {
      setTrainer(prev => ({
        ...prev,
        [name]: value.split(",").map(item => item.trim()).filter(Boolean),
      }));
    } else if (name === "experienceYears" || name === "ratePerSession") {
      setTrainer(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setTrainer(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleWorkingZonesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setTrainer(prev => ({
      ...prev,
      workingZones: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate National ID
    if (!/^\d{8}$/.test(trainer.nationalId)) {
      setError("National ID must be exactly 8 digits.");
      return;
    }

    // Validate required fields
    if (!trainer.fullName || !trainer.email || !trainer.phone1 || !trainer.specialization || !trainer.trainerType || !trainer.availability || !trainer.city || !trainer.country || !trainer.preferredMode) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/create-trainer", trainer);
      if (res.status === 201) {
        setSuccess("Trainer created successfully.");
        setTrainer({
          nationalId: generateNationalId(),
          fullName: "",
          email: "",
          phone1: "",
          phone2: "",
          website: "",
          gender: "",
          specialization: "",
          credentials: [],
          experienceYears: 0,
          languages: [],
          trainerType: "",
          availability: "",
          ratePerSession: 0,
          city: "",
          country: "",
          preferredMode: "",
          canTravel: false,
          workingZones: [],
          contractStartDate: "",
          contractEndDate: "",
          status: "Active",
          trainerProfile: "",
          remarks: "",
          portfolioLinks: [],
          addedBy: "",
        });
      }
    } catch (err) {
      setError("Failed to create trainer.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Trainer</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "National ID:", name: "nationalId", readOnly: true },
              { label: "Full Name:", name: "fullName", placeholder: "e.g. John Doe" },
              { label: "Email:", name: "email", placeholder: "e.g. john.doe@example.com" },
              { label: "Phone 1:", name: "phone1", placeholder: "e.g. 0712345678" },
              { label: "Phone 2:", name: "phone2", placeholder: "e.g. 0798765432" },
              { label: "Website:", name: "website", placeholder: "e.g. https://johndoe.com" },
              { label: "Specialization:", name: "specialization", placeholder: "e.g. ISO Training" },
              { label: "Experience (Years):", name: "experienceYears", type: "number", placeholder: "e.g. 5" },
              { label: "Availability:", name: "availability", placeholder: "e.g. Mon-Fri, 9AM-5PM" },
              { label: "Rate per Session:", name: "ratePerSession", type: "number", placeholder: "e.g. 100" },
            ].map(({ label, name, placeholder, readOnly = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(trainer as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                  min={0}
                />
              </div>
            ))}
                   <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="contractStartDate" className="text-sm text-black">Contract Start Date:</label>
              <input
                type="date"
                name="contractStartDate"
                value={trainer.contractStartDate}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="contractEndDate" className="text-sm text-black">Contract End Date:</label>
              <input
                type="date"
                name="contractEndDate"
                value={trainer.contractEndDate}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="gender" className="text-sm text-black">Gender:</label>
              <select
                name="gender"
                value={trainer.gender}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {[
              { label: "Credentials:", name: "credentials", placeholder: "e.g. ISO Trainer, OSHA" },
              { label: "Languages:", name: "languages", placeholder: "e.g. English, Swahili" },
              { label: "Portfolio Links:", name: "portfolioLinks", placeholder: "e.g. linkedin.com/johndoe" },
            ].map(({ label, name, placeholder }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={(trainer as any)[name].join(", ")}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="trainerType" className="text-sm text-black">Trainer Type:</label>
              <select
                name="trainerType"
                value={trainer.trainerType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select type</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
                <option value="Consultant">Consultant</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="preferredMode" className="text-sm text-black">Preferred Mode:</label>
              <select
                name="preferredMode"
                value={trainer.preferredMode}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select mode</option>
                <option value="In-person">In-person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="workingZones" className="text-sm text-black">Working Zones:</label>
              <select
                multiple
                name="workingZones"
                value={trainer.workingZones}
                onChange={handleWorkingZonesChange}
                className="bg-[#D9D9D9] h-20 w-36 rounded-md pl-2 text-sm text-black"
              >
                {branches.map((branch) => (
                  <option key={branch.branchCode} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="canTravel" className="text-sm text-black">Can Travel:</label>
              <input
                type="checkbox"
                name="canTravel"
                checked={trainer.canTravel}
                onChange={handleChange}
                className="h-6"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">Status:</label>
              <select
                name="status"
                value={trainer.status}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="city" className="text-sm text-black">City:</label>
              <input
                type="text"
                name="city"
                value={trainer.city}
                onChange={handleChange}
                placeholder="e.g. Nairobi"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="country" className="text-sm text-black">Country:</label>
              <input
                type="text"
                name="country"
                value={trainer.country}
                onChange={handleChange}
                placeholder="e.g. Kenya"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>
     
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="addedBy" className="text-sm text-black">Added By:</label>
              <select
                name="addedBy"
                value={trainer.addedBy}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="trainerProfile" className="text-sm text-black">Trainer Profile:</label>
              <textarea
                name="trainerProfile"
                value={trainer.trainerProfile}
                onChange={handleChange}
                placeholder="Enter trainer profile..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={trainer.remarks}
                onChange={handleChange}
                placeholder="Enter any remarks..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>
<div className="flex flex-row justify-center gap-4">
        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md"
        >
          ➕ Add Trainer
        </button>
            <button
        className="bg-[#E75D5D] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md"
        type="button"
        onClick={() => router.back()}
      >
        ❌ Back
      </button>
      </div>
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
