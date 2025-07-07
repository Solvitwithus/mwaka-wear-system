"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type PaymentMethod = {
  code: string;
  name: string;
  description: string;
  supportedTypes: string;
  isActive: boolean;
  notes: string;
};

const generatePaymentMethodCode = (prefix = "PM", length = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

const PaymentMethodPage = () => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    code: "",
    name: "",
    description: "",
    supportedTypes: "",
    isActive: true,
    notes: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPaymentMethod(prev => ({
      ...prev,
      code: generatePaymentMethodCode(),
    }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setPaymentMethod(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setPaymentMethod(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/paymentmethod", paymentMethod);
      if (res.status === 201) {
        setSuccess("✅ Payment method created successfully.");
        setPaymentMethod({
          code: generatePaymentMethodCode(),
          name: "",
          description: "",
          supportedTypes: "",
          isActive: true,
          notes: "",
        });
      }
    } catch {
      setError("❌ Failed to create payment method.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#265b3a]">Create Payment Method</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">

          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Payment Method Code:", name: "code", readOnly: true },
              { label: "Method Name:", name: "name", placeholder: "e.g. Bank Transfer" },
              { label: "Description:", name: "description", placeholder: "e.g. Used for bank payments" },
              { label: "Supported Types:", name: "supportedTypes", placeholder: "e.g. Cash, Card, M-Pesa" },
            ].map(({ label, name, placeholder, readOnly = false }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={(paymentMethod as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#4c5955]"
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="isActive" className="text-sm text-black">Status:</label>
              <input
                type="checkbox"
                name="isActive"
                checked={paymentMethod.isActive}
                onChange={handleChange}
                className="h-6"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="notes" className="text-sm text-black">Notes:</label>
              <textarea
                name="notes"
                value={paymentMethod.notes}
                onChange={handleChange}
                placeholder="Any additional info..."
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#4c5955]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Payment Method
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

export default PaymentMethodPage;
