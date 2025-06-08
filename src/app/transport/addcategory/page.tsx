"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type VehicleCategory = {
  categoryName: string;
  description: string;
  maxLoad: number | "";
  type: string;
  isActive: boolean;
};

const initialState: VehicleCategory = {
  categoryName: "",
  description: "",
  maxLoad: "",
  type: "",
  isActive: false,
};

const vehicleTypes = [
  "Truck",
  "Sedan",
  "Bus",
  "Van",
  "Motorcycle",
  "SUV",
  "Pickup",
  "Trailer",
];

const Page = () => {
  const router = useRouter();
  const [category, setCategory] = useState<VehicleCategory>(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setCategory((prev) => ({
      ...prev,
      [name]:
        name === "maxLoad"
          ? value === ""
            ? ""
            : Number(value)
          : name === "isActive" && type === "checkbox" && e.target instanceof HTMLInputElement
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
      setError("Please select a vehicle type.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/addvehiclecategory", category);
      if (res.status === 201) {
        setSuccess("Vehicle category created successfully.");
        setCategory(initialState);
      }
    } catch (err) {
      setError("Failed to create vehicle category.");
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
        Create Vehicle Category
      </h4>

      <form
        onSubmit={handleSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {/* Category Name */}
            <div className="flex justify-end gap-2 mb-1">
              <label
                htmlFor="categoryName"
                className="text-sm text-black"
              >
                Category Name:
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                placeholder="e.g. Heavy Truck"
                value={category.categoryName}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            {/* Description */}
            <div className="flex justify-end gap-2 mb-1">
              <label
                htmlFor="description"
                className="text-sm text-black"
              >
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                placeholder="Additional details about the category"
                value={category.description}
                onChange={handleChange}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">

            {/* Max Load Capacity */}
            <div className="flex justify-end gap-2 mb-1">
              <label
                htmlFor="maxLoad"
                className="text-sm text-black"
              >
                Max Load Capacity (kg):
              </label>
              <input
                type="number"
                name="maxLoad"
                id="maxLoad"
                placeholder="e.g. 15000"
                value={category.maxLoad}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                min={0}
              />
            </div>

            {/* Vehicle Type */}
            <div className="flex justify-end gap-2 mb-1">
              <label
                htmlFor="type"
                className="text-sm text-black"
              >
                Vehicle Type:
              </label>
              <select
                name="type"
                id="type"
                value={category.type}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Vehicle Type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Is Active */}
            <div className="flex justify-end gap-2 mb-1">
              <label
                htmlFor="isActive"
                className="text-sm text-black"
              >
                Is Active:
              </label>
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={category.isActive}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              />
            </div>

          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Vehicle Category
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
