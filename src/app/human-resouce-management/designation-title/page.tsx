"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Department = {
  id: string;
  departmentName: string;
};

type Rank = {
  id: string;
  rankName: string;
};

type Designation = {
  titleName: string;
  shortCode: string;
  departmentId: string;
  rankId: string;
  description: string;
  isActive: boolean;
  isNew: boolean;
  salary: number;

};

const initialState: Designation = {
  titleName: "",
  shortCode: "",
  departmentId: "",
  rankId: "",
  description: "",
  isActive: true,
  isNew: false,
  salary: 0,

};

const Page = () => {
  const router = useRouter();
  const [designation, setDesignation] = useState<Designation>(initialState);
  const [code, setCode] = useState<string>("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Generate random title code
  useEffect(() => {
    const randomCode = `DSGN-${Math.floor(Math.random() * 100000)}`;
    setCode(randomCode);
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch departments and ranks
  const fetchData = useCallback(async () => {
    try {
      const [deptRes, rankRes] = await Promise.all([
        axios.get("/api/auth/create-department"),
        axios.get("/api/auth/create-rank"),
      ]);
      setDepartments(deptRes.data);
      setRanks(rankRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load departments or ranks.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const handleChange = (
  e: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value, type } = e.target;

  const newValue =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;

  setDesignation((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...designation, titleCode: code };
      const res = await axios.post("/api/auth/create-designation", payload);
      if (res.status === 201) {
        setSuccess("Designation created successfully.");
        setDesignation(initialState);
        const newCode = `DSGN-${Math.floor(Math.random() * 100000)}`;
        setCode(newCode);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create designation.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Designation</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="titleName" className="text-sm text-black">Title Name:</label>
              <input
                type="text"
                id="titleName"
                name="titleName"
                value={designation.titleName}
                onChange={handleChange}
                placeholder="Enter designation title"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="shortCode" className="text-sm text-black">Short Code:</label>
              <input
                type="text"
                id="shortCode"
                name="shortCode"
                value={designation.shortCode}
                onChange={handleChange}
                placeholder="Short code e.g. HOD"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="departmentId" className="text-sm text-black">Department:</label>
              <select
                name="departmentId"
                id="departmentId"
                value={designation.departmentId}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="rankId" className="text-sm text-black">Rank:</label>
              <select
                name="rankId"
                id="rankId"
                value={designation.rankId}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">Select Rank</option>
                {ranks.map((rank) => (
                  <option key={rank.id} value={rank.id}>
                    {rank.rankName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isActive" className="text-sm text-black">Is Active:</label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={designation.isActive}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isNew" className="text-sm text-black">Is New:</label>
              <input
                type="checkbox"
                id="isNew"
                name="isNew"
                checked={designation.isNew}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="titleCode" className="text-sm text-black">Title Code:</label>
              <input
                type="text"
                id="titleCode"
                value={code}
                disabled
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-[#e48383] cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="salary" className="text-sm text-black">Salary:</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={designation.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">Description:</label>
              <textarea
                id="description"
                name="description"
                value={designation.description}
                onChange={handleChange}
                placeholder="Description"
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
          ➕ Add Designation
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
