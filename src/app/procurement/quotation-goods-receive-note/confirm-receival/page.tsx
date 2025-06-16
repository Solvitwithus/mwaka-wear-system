"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type SupplierItem = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
};

type Supplier = {
  id: string;
  name: string;
  bankName?: string;
  shortName?: string;
  paymentTerm?: string;
  creditLimit?: string;
  accountNumber?: string;
  phone?: string;
  blacklisted?: string;
  email?: string;
  kra?: string;
  preferredPaymentMethod?: string;
  website?: string;
  code?: string;
};

type SupplierReq = {
  id: string;
  reqId: string;
  contactPhone: string;
  contactEmail: string;
  shipping: number;
  subtotal: number;
  grandTotal: number;
  status: string;
  remarks: string;
  requisitionItems: SupplierItem[];
  supplier: Supplier | null;
};

const Page = () => {
  const router = useRouter();
  const [reqData, setReqData] = useState<SupplierReq | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("SupplierReqData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const withItemsKeyFixed = {
          ...parsed,
          requisitionItems: parsed.requisitionItems ?? parsed.items ?? [],
        };
        setReqData(withItemsKeyFixed);
      } catch (error) {
        console.error("Error parsing SupplierReqData:", error);
      }
    }
  }, []);

  const handleApprove = async () => {
    try {
      if (!reqData) return;
      const res = await axios.patch("/api/auth/purchase-quotation-entry", {
        id: reqData.id,
        status: "Received-ordered-goods",
      });
      if (res.status === 200) {
        alert("Supplier Requisition Approved!");
        router.back();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve requisition.");
    }
  };

  const supplier = reqData?.supplier;

  return (
    <div className="p-4">
      {reqData ? (
        <div className="bg-white p-4 rounded-md shadow-md space-y-6">
          {/* Supplier Info */}
          <div className="border border-gray-300 p-3 rounded-md">
            <h2 className="text-center text-md font-bold mb-2">Supplier Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div  className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Supplier Name</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.name || ""} />
              </div>
              <div  className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Payment Terms</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.paymentTerm || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Bank Name</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.bankName || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Credit Limit</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.creditLimit || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Account Number</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.accountNumber || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Phone</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.phone || reqData.contactPhone} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Email</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.email || reqData.contactEmail} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">KRA PIN</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.kra || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Preferred Payment Method</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.preferredPaymentMethod || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Website</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.website || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Blacklisted</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.blacklisted || ""} />
              </div>
              <div className='flex gap-1 justify-end'>
                <label className="text-sm text-gray-600">Supplier Code</label>
                <input readOnly className="w-full  h-5 bg-gray-100 rounded px-2 py-1" value={supplier?.code || ""} />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-300 p-3 rounded-md">
            <h2 className="text-md font-bold mb-2">Requisitioned Items</h2>
            <table className="w-full table-auto text-sm border border-gray-400">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="border px-2 py-1">Item ID</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Qty</th>
                  <th className="border px-2 py-1">Unit Price</th>
                  <th className="border px-2 py-1">Discount</th>
                  <th className="border px-2 py-1">Tax</th>
                  <th className="border px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {reqData.requisitionItems.map((item, i) => (
                  <tr key={i} className="text-center">
                    <td className="border px-2 py-1">{item.itemId}</td>
                    <td className="border px-2 py-1">{item.itemName}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                    <td className="border px-2 py-1">{item.unitPrice}</td>
                    <td className="border px-2 py-1">{item.discount}</td>
                    <td className="border px-2 py-1">{item.tax}</td>
                    <td className="border px-2 py-1">{item.total}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td colSpan={7} className="text-end px-4 py-1">
                    Shipping: {reqData.shipping}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td colSpan={7} className="text-end px-4 py-1">
                    Subtotal: {reqData.subtotal}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td colSpan={7} className="text-end px-4 py-1">
                    Grand Total: {reqData.grandTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md font-semibold"
            >
              Approve Requisition
            </button>
            <button
              onClick={() => router.back()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading requisition data...</p>
      )}
    </div>
  );
};

export default Page;
