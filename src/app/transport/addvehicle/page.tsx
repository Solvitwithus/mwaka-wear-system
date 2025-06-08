"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Branch = {
  branchCode: string;
  name: string;
};

type Driver = {
  userName: string;
  licenseNumber: string;
};

type Vehicle = {
  plateNumber: string;
  model: string;
};

type Shift = {
  shiftName: string;
  shiftCode: string;
  startTime: string;
  endTime: string;
  shiftActiveDate: string;
  driver: string;
  vehicle: string;
  transportationItem: string;
  startLocation: string;
  endLocation: string;
  wayPoint: string;
  isActive: string;
  comment: string;
};

const initialState: Shift = {
  shiftName: "",
  shiftCode: "",
  startTime: "",
  endTime: "",
  shiftActiveDate: "",
  driver: "",
  vehicle: "",
  transportationItem: "",
  startLocation: "",
  endLocation: "",
  wayPoint: "",
  isActive: "Yes",
  comment: "",
};

const Page = () => {
  const router = useRouter();
  const [shift, setShift] = useState<Shift>(initialState);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShift((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/addshift", shift);
      if (res.status === 201) {
        setSuccess("Shift created successfully.");
        setShift(initialState);
      }
    } catch (err) {
      setError("Failed to create shift.");
      console.error(err);
    }
  };

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/adddriver");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/addvehicle");
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/addbranch");
      setBranches(res.data);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
    fetchBranches();
  }, [fetchDrivers, fetchVehicles, fetchBranches]);

  useEffect(() => {
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
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Shift</h4>

      <form onSubmit={handleSubmit} className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto">
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Shift Name:", name: "shiftName", placeholder: "Morning Shift", type: "text" },
              { label: "Shift Code:", name: "shiftCode", placeholder: "MSH001", type: "text" },
              { label: "Start Time:", name: "startTime", placeholder: "", type: "time" },
              { label: "End Time:", name: "endTime", placeholder: "", type: "time" },
              { label: "Shift Active Date:", name: "shiftActiveDate", placeholder: "", type: "date" },
              { label: "Transportation Item:", name: "transportationItem", placeholder: "Goods, Staff", type: "text" },
              { label: "Way Point:", name: "wayPoint", placeholder: "e.g. Nairobi CBD", type: "text" },
            ].map(({ label, name, placeholder, type }) => (
              <div key={name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={(shift as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Driver */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="driver" className="text-sm text-black">Driver:</label>
              <select
                name="driver"
                value={shift.driver}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d.licenseNumber} value={d.userName}>{d.userName}</option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="vehicle" className="text-sm text-black">Vehicle:</label>
              <select
                name="vehicle"
                value={shift.vehicle}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.plateNumber} value={v.plateNumber}>{v.plateNumber}</option>
                ))}
              </select>
            </div>

            {/* Start Location */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="startLocation" className="text-sm text-black">Start Location:</label>
              <select
                name="startLocation"
                value={shift.startLocation}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.branchCode} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* End Location */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="endLocation" className="text-sm text-black">End Location:</label>
              <select
                name="endLocation"
                value={shift.endLocation}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.branchCode} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Is Active */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="isActive" className="text-sm text-black">Is Active:</label>
              <select
                name="isActive"
                value={shift.isActive}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Comment */}
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="comment" className="text-sm text-black">Comment:</label>
              <textarea
                name="comment"
                value={shift.comment}
                onChange={handleChange}
                placeholder="Additional notes"
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Shift
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
