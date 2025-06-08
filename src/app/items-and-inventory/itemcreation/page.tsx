"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const generateCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const generateBarcode = (): string => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

type Item = {
  code: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  description: string;
  excludeFromSale: boolean;
  excludeFromPurchase: boolean;
  branch: string;
  creator: string;
  status: string;
  barcode: string;
  itemPrice: number;
  discountWholesale: number;
  discountRetail: number;
  customDiscountAllowed: boolean;
  taxType: string;
};
type Tax = {
  name: string;
  code: string;
};
type ItemCategory = {
  categoryName: string;
  categoryCode: string;
};

type Measure = {
  unitName: string;
};

type Branch = {
  branchCode: string;
  name: string;
};

type User = {
  userName: string;
};

const initialState: Item = {
  code: generateCode(),
  name: "",
  category: "",
  unitOfMeasure: "",
  description: "",
  excludeFromSale: false,
  excludeFromPurchase: false,
  branch: "",
  creator: "",
  status: "Active",
  barcode: generateBarcode(),
  itemPrice: 0,
  discountWholesale: 0,
  discountRetail: 0,
  customDiscountAllowed: false,
  taxType:""
};

const statusOptions = ["Active", "Inactive"];

const Page = () => {
  const router = useRouter();
  const [item, setItem] = useState<Item>(initialState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
const [taxTypes, setTaxTypes] = useState<Tax[]>([]);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : type === "number"
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/items-creation", item);
      if (res.status === 201) {
        setSuccess("Item created successfully.");
        setItem({ ...initialState, code: generateCode(), barcode: generateBarcode() });
      }
    } catch (err) {
      setError("Failed to create item.");
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [success, error]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [catRes, measRes, branchRes, userRes,taxRes] = await Promise.all([
        axios.get("/api/auth/item-category"),
        axios.get("/api/auth/unit-of-measure"),
        axios.get("/api/auth/addbranch"),
        axios.get("/api/auth/user"),
        axios.get("/api/auth/create-tax"),
      ]);
      setCategories(catRes.data);
      setMeasures(measRes.data);
      setBranches(branchRes.data);
      setUsers(userRes.data);
      setTaxTypes(taxRes.data)
      alert()
    } catch (err) {
      console.error("Error fetching form data:", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Create Item</h4>
      <form
        onSubmit={handleSubmit}
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-20 py-8">
          <div className="flex flex-col">
            {[
              { label: "Name", name: "name", placeholder: "e.g. Ball Pen" },
              { label: "Code", name: "code", readOnly: true },
              { label: "Barcode", name: "barcode", readOnly: true },
              { label: "Item Price", name: "itemPrice", type: "number" },
              { label: "Discount Wholesale (%)", name: "discountWholesale", type: "number" },
              { label: "Discount Retail (%)", name: "discountRetail", type: "number" },
            ].map((field) => (
              <div key={field.name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={field.name} className="text-sm text-black">{field.label}:</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  id={field.name}
                  value={(item as any)[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  readOnly={field.readOnly}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="customDiscountAllowed" className="text-sm text-black">Custom Discount Allowed:</label>
              <input
                type="checkbox"
                name="customDiscountAllowed"
                id="customDiscountAllowed"
                checked={item.customDiscountAllowed}
                onChange={handleChange}
              />
            </div>
<div className="flex justify-end gap-2 mb-1">
  <label htmlFor="taxType" className="text-sm text-black">Tax Type:</label>
  <select
    name="taxType"
    id="taxType"
    value={item.taxType}
    onChange={handleChange}
    className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
  >
    <option value="">Select Tax Type</option>
    {taxTypes.map((tax, idx) => (
      <option key={idx} value={tax.code}>{tax.name}</option>
    ))}
  </select>
</div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="description" className="text-sm text-black">Description:</label>
              <textarea
                name="description"
                id="description"
                value={item.description}
                onChange={handleChange}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="excludeFromSale" className="text-sm text-black">Exclude from Sale:</label>
              <input
                type="checkbox"
                name="excludeFromSale"
                id="excludeFromSale"
                checked={item.excludeFromSale}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="excludeFromPurchase" className="text-sm text-black">Exclude from Purchase:</label>
              <input
                type="checkbox"
                name="excludeFromPurchase"
                id="excludeFromPurchase"
                checked={item.excludeFromPurchase}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            {[
              { label: "Category", name: "category", options: categories.map(c => ({ label: c.categoryName, value: c.categoryCode })) },
              { label: "Unit of Measure", name: "unitOfMeasure", options: measures.map(m => ({ label: m.unitName, value: m.unitName })) },
              { label: "Branch", name: "branch", options: branches.map(b => ({ label: b.name, value: b.branchCode })) },
              { label: "Creator", name: "creator", options: users.map(u => ({ label: u.userName, value: u.userName })) },
              { label: "Status", name: "status", options: statusOptions.map(s => ({ label: s, value: s })) },
            ].map((field) => (
              <div key={field.name} className="flex justify-end gap-2 mb-1">
                <label htmlFor={field.name} className="text-sm text-black">{field.label}:</label>
                <select
                  name={field.name}
                  id={field.name}
                  value={(item as any)[field.name]}
                  onChange={handleChange}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Item
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
