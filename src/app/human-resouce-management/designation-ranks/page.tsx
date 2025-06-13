"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Rank = {
  rankName: string;
  shortName: string;
  description: string;
  rankLevel: number;
  isActive: boolean;
  createdDate: string;
};

const initialState: Rank = {
  rankName: "",
  shortName: "",
  description: "",
  rankLevel: 1,
  isActive: true,
  createdDate: "",
};

const Page = () => {
  const router = useRouter();
  const [rank, setRank] = useState<Rank>(initialState);
  const [code, setCode] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const randomCode = `RANK-${Math.floor(Math.random() * 100000)}`;
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
    const { name, value, type, checked } = e.target;
    setRank((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...rank, code };
      const res = await axios.post("/api/auth/create-rank", payload);
      if (res.status === 201) {
        setSuccess("Rank created successfully.");
        setRank(initialState);
        const newCode = `RANK-${Math.floor(Math.random() * 100000)}`;
        setCode(newCode);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create rank.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Rank</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              {
                label: "Rank Name:",
                name: "rankName",
                placeholder: "Enter full rank name",
                type: "text",
              },
              {
                label: "Short Name:",
                name: "shortName",
                placeholder: "e.g. L/CPL, CPL, SGT",
                type: "text",
              },
              {
                label: "Rank Level:",
                name: "rankLevel",
                placeholder: "Enter rank level (1, 2, 3...)",
                type: "number",
              },
              {
                label: "Created Date:",
                name: "createdDate",
                placeholder: "",
                type: "date",
              },
            ].map(({ label, name, placeholder, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(rank as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            {/* Is Active */}
            <div className="flex justify-end gap-2 mb-1 items-center">
              <label htmlFor="isActive" className="text-sm text-black">
                Is Active:
              </label>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={rank.isActive}
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

            {/* Description */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={rank.description}
                onChange={handleChange}
                placeholder="Brief description of the rank"
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
          ➕ Add Rank
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
