"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


type driverie = {
licenseNumber:string;
userName:string
}
type Vehicle = {
  plateNumber: string;
  make: string;
  model: string;
  yearOfManufacture: string;
  status: string;
  fuelType: string;
  capacity: string;
  driver: string;
  assignedBranch: string;
  purpose: string;
  remarks: string;
  initialOdometerReading: string;
  ownershipType: string;
};

const initialState: Vehicle = {
  plateNumber: "",
  make: "",
  model: "",
  yearOfManufacture: "",
  status: "Active",
  fuelType: "Petrol",
  capacity: "",
  driver: "",
  assignedBranch: "",
  purpose: "",
  remarks: "",
  initialOdometerReading: "",
  ownershipType: "Company",
};

const Page = () => {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle>(initialState);
  const [drivers, setDrivers] = useState<driverie[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/auth/adddriver"),
      axios.get("/api/auth/addbranch"),
    ])
      .then(([driverRes, branchRes]) => {
        setDrivers(driverRes.data);
        setBranches(branchRes.data.map((b: any) => b.name));
      })
      .catch((err) => console.error("Error fetching dropdowns:", err));
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
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/addvehicle", vehicle);
      if (res.status === 201) {
        setSuccess("Vehicle added successfully.");
        setVehicle(initialState);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add vehicle.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Add Vehicle</h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Plate Number:", name: "plateNumber", type: "text" },
              { label: "Make:", name: "make", type: "text" },
              { label: "Model:", name: "model", type: "text" },
              {
                label: "Year of Manufacture:",
                name: "yearOfManufacture",
                type: "text",
              },
              { label: "Capacity:", name: "capacity", type: "text" },
              {
                label: "Initial Odometer Reading:",
                name: "initialOdometerReading",
                type: "text",
              },
            ].map(({ label, name, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(vehicle as any)[name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            {/* Ownership Type */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="ownershipType" className="text-sm text-black">
                Ownership Type:
              </label>
              <select
                name="ownershipType"
                id="ownershipType"
                value={vehicle.ownershipType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="Company">Company</option>
                <option value="Leased">Leased</option>
                <option value="Hired">Hired</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Status */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="status" className="text-sm text-black">
                Status:
              </label>
              <select
                name="status"
                id="status"
                value={vehicle.status}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="fuelType" className="text-sm text-black">
                Fuel Type:
              </label>
              <select
                name="fuelType"
                id="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Assigned Branch */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="assignedBranch" className="text-sm text-black">
                Assigned Branch:
              </label>
              <select
                name="assignedBranch"
                id="assignedBranch"
                value={vehicle.assignedBranch}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Driver */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="driver" className="text-sm text-black">
                Driver:
              </label>
              <select
                name="driver"
                id="driver"
                value={vehicle.driver}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
              >
                <option value="">-- Select Driver --</option>
               {
               
               drivers.map((val)=>(
                <option key={val.licenseNumber} value={val.licenseNumber}>{val.userName}: {val.licenseNumber}</option>
               ))}
              </select>
            </div>

            {/* Purpose */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="purpose" className="text-sm text-black">
                Purpose:
              </label>
              <input
                type="text"
                name="purpose"
                id="purpose"
                value={vehicle.purpose}
                onChange={handleChange}
                placeholder="Business / Delivery / Staff"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

            {/* Remarks */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="remarks" className="text-sm text-black">
                Remarks:
              </label>
              <textarea
                name="remarks"
                id="remarks"
                rows={3}
                value={vehicle.remarks}
                onChange={handleChange}
                placeholder="Optional notes..."
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Vehicle
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
