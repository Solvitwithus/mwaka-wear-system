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

// Type Definitions

type VehicleGL = {
  vehicleId: string;
  glAccountName: string;
  glAccountCode: string;
  accountType: string;
  description: string;
  isDefault: boolean;
  isPrimaryAccount: boolean;
  isActive: boolean;
  effectiveFrom: string;
  openingBalance: number;
  remarks: string;
  driverUserName: string;
  licenseNumber: string;
  currencyCode: string;
};

type Vehicle = {
  id: string;
  plateNumber: string;
  model: string;
};

type Driver = {
  id: string;
  userName: string;
  licenseNumber: string;
};

type Currency = {
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
};

const initialState: VehicleGL = {
  vehicleId: "",
  glAccountName: "",
  glAccountCode: "",
  accountType: "Expense",
  description: "",
  isDefault: false,
  isPrimaryAccount: false,
  isActive: true,
  effectiveFrom: "",
  openingBalance: 0,
  remarks: "",
  driverUserName: "",
  licenseNumber: "",
  currencyCode: "",
};

const Page = () => {
  const router = useRouter();
  const [vehicleGL, setVehicleGL] = useState<VehicleGL>(initialState);
  const [code, setCode] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [vehicleRes, driverRes, currencyRes] = await Promise.all([
        axios.get("/api/auth/addvehicle"),
        axios.get("/api/auth/adddriver"),
        axios.get("/api/auth/currency"),
      ]);
      setVehicles(vehicleRes.data);
      setDrivers(driverRes.data);
      setCurrencies(currencyRes.data);
    } catch (err) {
      console.error("Error fetching dependencies:", err);
    }
  }, []);

  useEffect(() => {
    const randomCode = `VEH-GL-${Math.floor(Math.random() * 10000)}`;
    setCode(randomCode);
    fetchData();
  }, [fetchData]);

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
    setVehicleGL((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
       
    
    try {
      const payload = { ...vehicleGL, glAccountCode: code };
      const res = await axios.post("/api/auth/create-vehiclegl", payload);
      if (res.status === 201) {
        setSuccess("Vehicle GL Account created successfully.");
        setVehicleGL(initialState);
        const newCode = `VEH-GL-${Math.floor(Math.random() * 10000)}`;
        setCode(newCode);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create Vehicle GL Account.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
        Add Vehicle GL Account
      </h4>
      <form
        onSubmit={handleSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          <div className="flex flex-col">
            <label>Vehicle:</label>
            <select
              name="vehicleId"
              value={vehicleGL.vehicleId}
              onChange={handleChange}
              className="bg-[#D9D9D9] h-6 rounded-md mb-2"
            >
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} - {v.model}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="glAccountName"
              value={vehicleGL.glAccountName}
              onChange={handleChange}
              placeholder="GL Account Name"
              className="bg-[#D9D9D9] h-6 rounded-md pl-2 mb-2"
            />

            <select
              name="accountType"
              value={vehicleGL.accountType}
              onChange={handleChange}
              className="bg-[#D9D9D9] h-6 rounded-md mb-2"
            >
              <option value="Expense">Expense</option>
              <option value="Revenue">Revenue</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
            </select>

            <input
              type="date"
              name="effectiveFrom"
              value={vehicleGL.effectiveFrom}
              onChange={handleChange}
              className="bg-[#D9D9D9] h-6 rounded-md pl-2 mb-2"
            />

            <input
              type="number"
              name="openingBalance"
              value={vehicleGL.openingBalance}
              onChange={handleChange}
              placeholder="Opening Balance"
              className="bg-[#D9D9D9] h-6 rounded-md pl-2 mb-2"
            />

            <select
              name="currencyCode"
              value={vehicleGL.currencyCode}
              onChange={handleChange}
              className="bg-[#D9D9D9] h-6 rounded-md mb-2"
            >
              <option value="">-- Select Currency --</option>
              {currencies.map((c) => (
                <option key={c.currencyCode} value={c.currencyCode}>
                  {c.currencyName} ({c.currencySymbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>GL Code (Auto):</label>
            <input
              type="text"
              value={code}
              disabled
              className="bg-[#D9D9D9] h-6 rounded-md pl-2 mb-2 text-[#e48383]"
            />

            <label>Driver:</label>
            <select
              name="driverUserName"
              value={vehicleGL.driverUserName}
              onChange={handleChange}
              className="bg-[#D9D9D9] h-6 rounded-md mb-2"
            >
              <option value="">-- Select Driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.userName}>
                  {d.userName} - {d.licenseNumber}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              value={vehicleGL.description}
              onChange={handleChange}
              placeholder="Description"
              className="bg-[#D9D9D9] rounded-md pl-2 mb-2"
              rows={3}
            />

            <textarea
              name="remarks"
              value={vehicleGL.remarks}
              onChange={handleChange}
              placeholder="Remarks"
              className="bg-[#D9D9D9] rounded-md pl-2 mb-2"
              rows={2}
            />

            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={vehicleGL.isDefault}
                onChange={handleChange}
              />
              Default Account
            </label>

            <label>
              <input
                type="checkbox"
                name="isPrimaryAccount"
                checked={vehicleGL.isPrimaryAccount}
                onChange={handleChange}
              />
              Primary Account
            </label>

            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={vehicleGL.isActive}
                onChange={handleChange}
              />
              Is Active
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add GL Account
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
