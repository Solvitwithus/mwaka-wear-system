"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type UnitOfMeasure = {
  unitName: string;
  abbreviation: string;
  description: string;
  conversionFactor: number;
  isBaseUnit: boolean;
  isActive: boolean;
};

const initialState: UnitOfMeasure = {
  unitName: "",
  abbreviation: "",
  description: "",
  conversionFactor: 1,
  isBaseUnit: false,
  isActive: true,
};

const Page = () => {
  const router = useRouter();
  const [unit, setUnit] = useState<UnitOfMeasure>(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setUnit((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!unit.unitName.trim()) {
      setError("Unit name is required.");
      return;
    }
    if (!unit.abbreviation.trim()) {
      setError("Abbreviation is required.");
      return;
    }
    if (unit.conversionFactor <= 0) {
      setError("Conversion factor must be greater than zero.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/unit-of-measure", unit);
      if (res.status === 201) {
        setSuccess("Unit of Measure created successfully.");
        setUnit(initialState);
      }
    } catch (err) {
      setError("Failed to create unit.");
      console.error(err);
    }
  };

  React.useEffect(() => {
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
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
        Create Unit of Measure
      </h4>

      <form
        onSubmit={handleSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {/* Unit Name */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="unitName" className="text-sm text-black">
                Unit Name:
              </label>
              <input
                type="text"
                name="unitName"
                id="unitName"
                placeholder="e.g. Kilogram"
                value={unit.unitName}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            {/* Abbreviation */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="abbreviation" className="text-sm text-black">
                Abbreviation:
              </label>
              <input
                type="text"
                name="abbreviation"
                id="abbreviation"
                placeholder="e.g. kg"
                value={unit.abbreviation}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            {/* Description */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                placeholder="Describe how the unit is used"
                value={unit.description}
                onChange={handleChange}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Conversion Factor */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="conversionFactor" className="text-sm text-black">
                Conversion Factor:
              </label>
              <input
                type="number"
                name="conversionFactor"
                id="conversionFactor"
                min={0.0001}
                step={0.0001}
                placeholder="e.g. 1"
                value={unit.conversionFactor}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            {/* Base Unit */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="isBaseUnit" className="text-sm text-black">
                Is Base Unit:
              </label>
              <input
                type="checkbox"
                name="isBaseUnit"
                id="isBaseUnit"
                checked={unit.isBaseUnit}
                onChange={handleChange}
                className="h-4 w-4 mt-1"
              />
            </div>

            {/* Status */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="isActive" className="text-sm text-black">
                Is Active:
              </label>
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={unit.isActive}
                onChange={handleChange}
                className="h-4 w-4 mt-1"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Unit
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
        <div className="text-green-600 text-center font-semibold">{success}</div>
      )}
      {error && (
        <div className="text-red-600 text-center font-semibold">{error}</div>
      )}
    </div>
  );
};

export default Page;
