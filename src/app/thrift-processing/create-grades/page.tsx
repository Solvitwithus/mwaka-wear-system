"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Grade = {
  gradeName: string;
  description: string;
  qualityLevel: string;
  materialQuality: string;
  condition: string;
  isActive: boolean;
};

const initialState: Grade = {
  gradeName: "",
  description: "",
  qualityLevel: "",
  materialQuality: "",
  condition: "",
  isActive: true,
};

const Page = () => {
  const router = useRouter();
  const [grade, setGrade] = useState<Grade>(initialState);
  const [code, setCode] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-generate code on mount
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Ensures 5 digits
    const randomCode = `G-${randomDigits}`;
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

  setGrade((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...grade, code };
      const res = await axios.post("/api/auth/grade-creation", payload);
      if (res.status === 201) {
        setSuccess("Grade created successfully.");
        setGrade(initialState);
        const newCode = `G-${Math.floor(10000 + Math.random() * 90000)}`;
        setCode(newCode);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create grade.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Grade</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {/* Grade Name */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="gradeName" className="text-sm text-black">
                Grade Name:
              </label>
              <input
                type="text"
                name="gradeName"
                id="gradeName"
                value={grade.gradeName}
                onChange={handleChange}
                placeholder="e.g. Grade A"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            {/* Quality Level */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="qualityLevel" className="text-sm text-black">
                Quality Level:
              </label>
              <select
                name="qualityLevel"
                id="qualityLevel"
                value={grade.qualityLevel}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">-- Select --</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Salvage">Salvage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Material Quality */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="materialQuality" className="text-sm text-black">
                Material Quality:
              </label>
              <select
                name="materialQuality"
                id="materialQuality"
                value={grade.materialQuality}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">-- Select --</option>
                <option value="Pure Cotton">Pure Cotton</option>
                <option value="Mixed Fabric">Mixed Fabric</option>
                <option value="Polyester">Polyester</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Is Active */}
            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isActive" className="text-sm text-black">
                Is Active:
              </label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={grade.isActive}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Auto-generated Code */}
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

            {/* Condition */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="condition" className="text-sm text-black">
                Condition:
              </label>
              <select
                name="condition"
                id="condition"
                value={grade.condition}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">-- Select --</option>
                <option value="New">New</option>
                <option value="Slightly Used">Slightly Used</option>
                <option value="Overstock">Overstock</option>
                <option value="Damaged">Damaged</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={grade.description}
                onChange={handleChange}
                placeholder="Brief description of this grade"
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
          ➕ Add Grade
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
