"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Installment = {
  dueAfterDays: number;
  percentage: number;
};

type PaymentTerm = {
  name: string;
  description: string;
  totalDuration: number;
  numInstallments: number;
  installments: Installment[];
  startDateRule: string;
  gracePeriod: number;
  lateFeeEnabled: boolean;
  lateFeeType: string;
  lateFeeAmount: number;
  lateFeeAfterDays: number;
  earlyDiscountEnabled: boolean;
  earlyDiscountPercent: number;
  earlyDiscountWithinDays: number;
  allowedMethods: string[];
  applicableTo: string[];
  isActive: boolean;
  notes: string;
};

const Page = () => {
  const router = useRouter();

  const initialState: PaymentTerm = {
    name: "",
    description: "",
    totalDuration: 30,
    numInstallments: 1,
    installments: [{ dueAfterDays: 0, percentage: 100 }],
    startDateRule: "Invoice Date",
    gracePeriod: 0,
    lateFeeEnabled: false,
    lateFeeType: "Flat",
    lateFeeAmount: 0,
    lateFeeAfterDays: 0,
    earlyDiscountEnabled: false,
    earlyDiscountPercent: 0,
    earlyDiscountWithinDays: 0,
    allowedMethods: [],
    applicableTo: [],
    isActive: true,
    notes: "",
  };

  const [term, setTerm] = useState<PaymentTerm>(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setTerm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (["totalDuration", "numInstallments", "gracePeriod", "lateFeeAmount", "lateFeeAfterDays", "earlyDiscountPercent", "earlyDiscountWithinDays"].includes(name)) {
      setTerm((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setTerm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
// No matter what happens do not and I repeat do not make any changes from this part going onwards!!!!!!!!!!!!!
// Infact just ignore this module or you'll have no system ❌❌❌❌❌❌❌👌👌👌
// If i was you i would have closed this already why are you still here. Unless you just dont have a life bro☆*: .｡. o(≧▽≦)o .｡.:*☆
  const handleInstallmentChange = (index: number, field: keyof Installment, value: number) => {
    const updatedInstallments = [...term.installments];
    updatedInstallments[index][field] = value;
    setTerm((prev) => ({ ...prev, installments: updatedInstallments }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/payment-terms", term, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 201) {
        setSuccess("Payment Term created successfully!");
        setTerm(initialState);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create Payment Term!");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Payment Term</h4>
      <form
        onSubmit={handleFormSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Name", name: "name", placeholder: "Net 30" },
              { label: "Description", name: "description", placeholder: "Full payment in 30 days" },
              { label: "Total Duration (days)", name: "totalDuration", type: "number" },
              { label: "Number of Installments", name: "numInstallments", type: "number" },
              { label: "Grace Period (days)", name: "gracePeriod", type: "number" },
              { label: "Start Date Rule", name: "startDateRule", placeholder: "Invoice Date" , type:"date" },
              { label: "Late Fee Type", name: "lateFeeType", placeholder: "Flat or Percentage" },
              { label: "Late Fee Amount", name: "lateFeeAmount", type: "number" },
              { label: "Late Fee After (days)", name: "lateFeeAfterDays", type: "number" },
            ].map(({ label, name, type = "text", placeholder }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}:
                </label>
                <input
                  type={type}
                  name={name}
                  value={(term as any)[name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {[
              { label: "Early Discount %", name: "earlyDiscountPercent", type: "number" },
              { label: "Early Discount Within (days)", name: "earlyDiscountWithinDays", type: "number" },
            ].map(({ label, name, type }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}:
                </label>
                <input
                  type={type}
                  name={name}
                  value={(term as any)[name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm"
                />
              </div>
            ))}

            {[
              { label: "Late Fee Enabled", name: "lateFeeEnabled" },
              { label: "Early Discount Enabled", name: "earlyDiscountEnabled" },
              { label: "Active", name: "isActive" },
            ].map(({ label, name }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}:</label>
                <input
                  type="checkbox"
                  name={name}
                  checked={(term as any)[name]}
                  onChange={handleChange}
                  className="h-6"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="notes" className="text-sm text-black">
                Notes:
              </label>
              <textarea
                name="notes"
                value={term.notes}
                onChange={handleChange}
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm"
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>
        </div>

        <div className="mx-6 mt-2">
          <h5 className="text-sm font-semibold text-[#b13348]">Installment Details</h5>
          {term.installments.map((inst, index) => (
            <div key={index} className="flex gap-4 mt-1 mb-2">
              <input
                type="number"
                value={inst.dueAfterDays}
                onChange={(e) =>
                  handleInstallmentChange(index, "dueAfterDays", Number(e.target.value))
                }
                className="bg-[#D9D9D9] w-40 h-6 rounded-md pl-2 text-sm"
                placeholder="Due After Days"
              />
              <input
                type="number"
                value={inst.percentage}
                onChange={(e) =>
                  handleInstallmentChange(index, "percentage", Number(e.target.value))
                }
                className="bg-[#D9D9D9] w-40 h-6 rounded-md pl-2 text-sm"
                placeholder="Percentage"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Payment Term
        </button>
      </form>

      <button
        className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md"
        onClick={() => router.back()}
      >
        ❌ Back
      </button>

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
