"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Types
type SalesCategory = {
  code: string;
  name: string;
  description: string;
  priceAdjustmentType: "percentage" | "fixed";
  priceAdjustment: number;
  creditLimit: number;
  allowCredit: boolean;
  defaultPaymentTerm: string;
  applicableChannels: string; // 👈 Changed to string (comma-separated)
  isActive: boolean;
  remarks: string;
};

type Payment = {
  id: string;
  name: string;
};

const generateSalesCategoryCode = (prefix = "SC", length = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

const SalesCategoryPage = () => {
  const router = useRouter();

  const [salesCategory, setSalesCategory] = useState<SalesCategory>({
    code: "",
    name: "",
    description: "",
    priceAdjustmentType: "percentage",
    priceAdjustment: 0,
    creditLimit: 0,
    allowCredit: false,
    defaultPaymentTerm: "",
    applicableChannels: "", // 👈 Initial empty string
    isActive: true,
    remarks: "",
  });

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]); // 👈 Used for UI
  const [paymentTerms, setPaymentTerms] = useState<Payment[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchPaymentTerms = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/payment-terms");
      setPaymentTerms(response.data);
    } catch (error) {
      console.error("Failed to fetch payment terms:", error);
    }
  }, []);

  useEffect(() => {
    fetchPaymentTerms();
    setSalesCategory((prev) => ({
      ...prev,
      code: generateSalesCategoryCode(),
    }));
  }, [fetchPaymentTerms]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSalesCategory((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setSalesCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedChannels(selected);
    setSalesCategory((prev) => ({
      ...prev,
      applicableChannels: selected.join(","), // 👈 Store as CSV string
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...salesCategory,
      priceAdjustment: salesCategory.priceAdjustment ?? 0,
    };

    try {
      const res = await axios.post("/api/auth/sales-category", payload);
      if (res.status === 201) {
        setSuccess("✅ Sales category created successfully.");
        setSalesCategory({
          code: generateSalesCategoryCode(),
          name: "",
          description: "",
          priceAdjustmentType: "percentage",
          priceAdjustment: 0,
          creditLimit: 0,
          allowCredit: false,
          defaultPaymentTerm: "",
          applicableChannels: "",
          isActive: true,
          remarks: "",
        });
        setSelectedChannels([]); // 👈 Reset UI channels
      }
    } catch {
      setError("❌ Failed to create sales category.");
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
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#265b3a]">Create Sales Category</h4>

      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[{ label: "Code:", name: "code", readOnly: true },
              { label: "Name:", name: "name", placeholder: "e.g. Retail" },
              { label: "Description:", name: "description", placeholder: "e.g. Retail customers" },
              { label: "Price Adjustment:", name: "priceAdjustment", type: "number" },
              { label: "Credit Limit:", name: "creditLimit", type: "number" },
            ].map(({ label, name, placeholder, readOnly = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(salesCategory as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#4c5955]"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Price Adjustment Type:</label>
              <select name="priceAdjustmentType" value={salesCategory.priceAdjustmentType} onChange={handleChange}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Applicable Channels:</label>
              <select multiple value={selectedChannels} onChange={handleMultiSelect} required>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Online">Online</option>
                <option value="Field Sales">Field Sales</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Allow Credit:</label>
              <input type="checkbox" name="allowCredit" checked={salesCategory.allowCredit} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Status:</label>
              <input type="checkbox" name="isActive" checked={salesCategory.isActive} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Payment Terms:</label>
              <select
                name="defaultPaymentTerm"
                value={salesCategory.defaultPaymentTerm}
                onChange={handleChange}
              >
                <option value="">-- Select Payment Term --</option>
                {paymentTerms.map((term) => (
                  <option key={term.id} value={term.name}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Remarks:</label>
              <textarea
                name="remarks"
                value={salesCategory.remarks}
                onChange={handleChange}
                placeholder="Any notes..."
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
          ➕ Add Sales Category
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

export default SalesCategoryPage;
