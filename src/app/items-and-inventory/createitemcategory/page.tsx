"use client";

import React, { useState, ChangeEvent, FormEvent, useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Generate a random 6-digit alphanumeric code
const generateCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

type ItemCategory = {
  categoryName: string;
  categoryCode: string;
  description: string;
  type: string;
  unitOfMeasure: string;
  tags: string;
  isActive: boolean;
};

type Measure = {
  unitName: string;
};

const initialState: ItemCategory = {
  categoryName: "",
  categoryCode: generateCode(),
  description: "",
  type: "",
  unitOfMeasure: "",
  tags: "",
  isActive: false,
};

const categoryTypes = ["Physical", "Digital", "Service", "Other"];

const Page = () => {
  const router = useRouter();
  const [category, setCategory] = useState<ItemCategory>(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [unitofMeasure, setunitofMeasure] = useState<Measure[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]:
        name === "isActive" && type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category.categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!category.type) {
      setError("Please select a category type.");
      return;
    }
    if (!category.unitOfMeasure) {
      setError("Please select a unit of measure.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/item-category", category);
      if (res.status === 201) {
        setSuccess("Category created successfully.");
        setCategory({ ...initialState, categoryCode: generateCode() });
      }
    } catch (err) {
      setError("Failed to create category.");
      console.error(err);
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

  const fetchMeasure = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/unit-of-measure");
      setunitofMeasure(res.data);
    } catch (err) {
      console.error("Failed to fetch unit of measure:", err);
    }
  }, []);

  useEffect(() => {
    fetchMeasure();
  }, [fetchMeasure]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
        Create Item Category
      </h4>

      <form
        onSubmit={handleSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="categoryName" className="text-sm text-black">
                Category Name:
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                placeholder="e.g. Stationery"
                value={category.categoryName}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="categoryCode" className="text-sm text-black">
                Category Code:
              </label>
              <input
                type="text"
                name="categoryCode"
                id="categoryCode"
                value={category.categoryCode}
                readOnly
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-black"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                placeholder="Describe the category"
                value={category.description}
                onChange={handleChange}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="tags" className="text-sm text-black">
                Tags:
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="e.g. office, paper, tool"
                value={category.tags}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="type" className="text-sm text-black">
                Type:
              </label>
              <select
                name="type"
                id="type"
                value={category.type}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Type</option>
                {categoryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="unitOfMeasure" className="text-sm text-black">
                Unit of Measure:
              </label>
              <select
                name="unitOfMeasure"
                id="unitOfMeasure"
                value={category.unitOfMeasure}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Unit</option>
                {unitofMeasure.map((unit, idx) => (
                  <option key={idx} value={unit.unitName}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="isActive" className="text-sm text-black">
                Is Active:
              </label>
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={category.isActive}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md text-sm text-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Category
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
