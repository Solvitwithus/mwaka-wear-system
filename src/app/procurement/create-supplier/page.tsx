"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Types
const eastAfricanCountries = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "South Sudan"
];

const generateSupplierCode = (prefix = "SUP", length = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

type Supplier = {
  name: string;
  code: string;
  email: string;
  phone: string;
  phone2: string;
  country: string;
  county: string;
  town: string;
  address: string;
  kra: string;
  vat: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  preferredPaymentMethod: string;
  isActive: boolean;
  remarks: string;
  blacklisted: boolean;
  shortName: string;
  website: string;
  currency: string;
  taxType: string;
  creditLimit: number;
  paymentTerm: string;
};

const Page = () => {
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier>({
    name: "",
    code: generateSupplierCode(),
    email: "",
    phone: "",
    phone2: "",
    country: "",
    county: "",
    town: "",
    address: "",
    kra: "",
    vat: "",
    bankName: "",
    bankCode: "",
    accountNumber: "",
    preferredPaymentMethod: "",
    isActive: true,
    remarks: "",
    blacklisted: false,
    shortName: "",
    website: "",
    currency: "",
    taxType: "",
    creditLimit: 0,
    paymentTerm: "",
  });

  const [banks, setBanks] = useState<{ bankName: string; bankCode: string }[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<{ code: string; name: string }[]>([]);
  const [currencies, setCurrencies] = useState<{ currencyCode: string; currencyName: string }[]>([]);
  const [taxTypes, setTaxTypes] = useState<{ name: string; code: string }[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<{ name: string }[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/auth/bankname"),
      axios.get("/api/auth/paymentmethod"),
      axios.get("/api/auth/currency"),
      axios.get("/api/auth/create-tax"),
      axios.get("/api/auth/payment-terms"),
    ])
      .then(([banksRes, paymentsRes, currencyRes, taxRes, termRes]) => {
        setBanks(banksRes.data);
        setPaymentMethods(paymentsRes.data);
        setCurrencies(currencyRes.data);
        setTaxTypes(taxRes.data);
        setPaymentTerms(termRes.data);
      })
      .catch(() => setError("Failed to fetch select data"));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setSupplier((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    
    try {
      const res = await axios.post("/api/auth/add-supplier", supplier);
      if (res.status === 201) {
        setSuccess("✅ Supplier created successfully.");
        setSupplier({
          ...supplier,
          code: generateSupplierCode(),
          name: "",
          email: "",
          phone: "",
          phone2: "",
          country: "",
          county: "",
          town: "",
          address: "",
          kra: "",
          vat: "",
          bankName: "",
          bankCode: "",
          accountNumber: "",
          preferredPaymentMethod: "",
          isActive: true,
          remarks: "",
          blacklisted: false,
          shortName: "",
          website: "",
          currency: "",
          taxType: "",
          creditLimit: 0,
          paymentTerm: "",
        });
      }
    } catch {
      setError("❌ Failed to create supplier.");
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
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#265b3a]">Create Supplier</h4>
      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-20 py-8">
          <div className="flex flex-col">
            {[
              { label: "Code:", name: "code", readOnly: true },
              { label: "Name:", name: "name" },
              { label: "Email:", name: "email" },
              { label: "Phone:", name: "phone" },
              { label: "Phone 2:", name: "phone2" },
              { label: "County:", name: "county" },
              { label: "Town/City:", name: "town" },
              { label: "Address:", name: "address" },
              { label: "KRA PIN:", name: "kra" },
              { label: "VAT Number:", name: "vat" },
              { label: "Account Number:", name: "accountNumber" },
              { label: "Short Name:", name: "shortName" },
              { label: "Website:", name: "website" },
              { label: "Credit Limit:", name: "creditLimit", type: "number" },
            ].map(({ label, name, readOnly = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(supplier as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2"
                />
              </div>
            ))}

       
          </div>

          <div className="flex flex-col">
                 <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Country:</label>
              <select name="country" value={supplier.country} onChange={handleChange}>
                <option value="">--Select Country--</option>
                {eastAfricanCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Bank:</label>
              <select name="bankName" value={supplier.bankName} onChange={handleChange}>
                <option value="">-- Select Bank --</option>
                {banks.map((b) => (
                  <option key={b.bankCode} value={b.bankName}>{b.bankName}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Preferred Payment Method:</label>
              <select name="preferredPaymentMethod" value={supplier.preferredPaymentMethod} onChange={handleChange}>
                <option value="">-- Select Method --</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.code} value={pm.name}>{pm.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Currency:</label>
              <select name="currency" value={supplier.currency} onChange={handleChange}>
                <option value="">-- Select Currency --</option>
                {currencies.map((cur) => (
                  <option key={cur.currencyCode} value={cur.currencyCode}>{cur.currencyName}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Tax Type:</label>
              <select name="taxType" value={supplier.taxType} onChange={handleChange}>
                <option value="">-- Select Tax Type --</option>
                {taxTypes.map((t) => (
                  <option key={t.code} value={t.code}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Payment Term:</label>
              <select name="paymentTerm" value={supplier.paymentTerm} onChange={handleChange}>
                <option value="">-- Select Payment Term --</option>
                {paymentTerms.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Remarks:</label>
              <textarea name="remarks" value={supplier.remarks} onChange={handleChange} rows={3} className="bg-[#D9D9D9] rounded-md pl-2"/>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Is Active:</label>
              <input type="checkbox" name="isActive" checked={supplier.isActive} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Blacklisted:</label>
              <input type="checkbox" name="blacklisted" checked={supplier.blacklisted} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md">
          ➕ Add Supplier
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