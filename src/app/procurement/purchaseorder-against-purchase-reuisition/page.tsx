"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// --- Types ---
type PurchaseEntryItem = {
  itemName: string;
  quantity: number;
};

type DeliveryDetail = {
  deliverTo?: string;
  reqDate: string;
dueDate?: string;
  code?: string;
};

type Supplier = {
  name?: string;
  bankName?:string
id:string;
 
  reqId: string
  
  contactPhone: string
  contactEmail: string
  shipping: number
  subtotal: number
  grandTotal: number
  status: string
  remarks: string
};

type PurchaseReqEntry = {
  id: string;
  supplier: Supplier;
  purchaseAdditionalInfo?: DeliveryDetail; 
  items: PurchaseEntryItem[];             
  bankName?: string;
  reqDate: string;
  dueDate?: string;
  grandTotal: number;
  shipping: number;
  status: string;
};

// --- Component ---
const Page = () => {
const router = useRouter()
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseReqEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PurchaseReqEntry[]>([]);
  const [searchRef, setSearchRef] = useState("");
  const [searchBank, setSearchBank] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/auth/purchase-quotation-entry");
        const data = res.data.data || [];
       setPurchaseEntries(data);
        setFilteredEntries(data);
      } catch (error) {
        console.error("Error fetching sales entries:", error);
      }
    };

    fetchSales();
  }, []);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = purchaseEntries.filter((entry) => {
      if(entry.status !== "approved") return false;
     const refMatch = entry.purchaseAdditionalInfo?.dueDate
  ?.toLowerCase()
  .includes(searchRef.toLowerCase()) ?? true;

const destMatch = entry.purchaseAdditionalInfo?.deliverTo
  ?.toLowerCase()
  .includes(searchDestination.toLowerCase()) ?? true;

      const branchMatch = entry.supplier?.bankName
        ?.toLowerCase()
        .includes(searchBank.toLowerCase()) ?? true;

      

      return refMatch && branchMatch && destMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.reqDate).getTime();
      const dateB = new Date(b.reqDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEntries(filtered);
    setPage(1); // Reset page on filter change
  }, [searchRef, searchBank, searchDestination, sortOrder,purchaseEntries]);

  const paginatedEntries = filteredEntries.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
const handleLocalDataParsing = async (entry: PurchaseReqEntry) => {
  if (!entry) return;

  // Save data to localStorage for the next page to use
  localStorage.setItem("SupplierReqData", JSON.stringify(entry));

  try {
    // First update the status
    const res = await axios.patch("/api/auth/purchase-quotation-entry", {
      id: entry.id,
      status: "req-Placed",
    });

    if (res.status === 200) {
      alert("Supplier Requisition Approved!");

      // Navigate only after success
      router.push("/procurement/purchaseorder-against-purchase-reuisition/dox");

      // Clear localStorage after a delay
      setTimeout(() => {
        localStorage.removeItem("SupplierReqData");
      }, 1000 * 300); // 5 minutes
    }
  } catch (err) {
    console.error(err);
    alert("Failed to approve requisition.");
  }
};


  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Place Order To supplier</h4>

      {/* Filters */}
      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <div className="flex gap-4 justify-end flex-wrap">
          <input
            type="text"
            placeholder="Search by Customer Ref"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md "
          />
          <input
            type="text"
            placeholder="Search by Branch Name"
            value={searchBank}
            onChange={(e) => setSearchBank(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md "
          />
          <input
            type="text"
            placeholder="Search by Destination"
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
           className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md "
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md "
          >
            <option value="desc">Sort by: Most Recent First</option>
            <option value="asc">Sort by: Oldest First</option>
          </select>
        </div>

        {/* Table */}
        <div className="border-black border-[1px] m-1 rounded-md p-1">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#099EBA] text-white text-sm font-mono">
              <tr>
                <th className="p-2 border">No.</th>
                <th className="p-2 border">Supplier Ref</th>
                <th className="p-2 border">Supplier Name</th>
                <th className="p-2 border">Bank Name</th>
                <th className="p-2 border">Destination</th>
                <th className="p-2 border">Order Date</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Shipping</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center p-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">
                      {entry.supplier?.id || "-"}
                    </td>
                    <td className="p-1 border">
                      {entry.supplier.name || "-"}
                    </td>
                    <td className="p-1 border">{entry.supplier.bankName || "-"}</td>
                    <td className="p-2 border">
  {entry.purchaseAdditionalInfo?.deliverTo || "-"}
</td>
<td className="p-1 border">
  {entry.purchaseAdditionalInfo?.reqDate
    ? new Date(entry.purchaseAdditionalInfo.reqDate).toLocaleDateString()
    : "-"}
</td>
<td className="p-1 border">
  {entry.purchaseAdditionalInfo?.dueDate
    ? new Date(entry.purchaseAdditionalInfo.dueDate).toLocaleDateString()
    : "-"}
</td>
<td className="p-1 border">{entry.items?.[0]?.itemName || "-"}</td>
<td className="p-1 border">{entry.items?.[0]?.quantity || "-"}</td>
                    <td className="p-1 border">{entry.grandTotal}</td>
                    <td className="p-1 border">{entry.shipping}</td>
                
                    <td className="p-2 border">
                      <button className="bg-[#1393AB]  text-white px-2 py-1 rounded text-xs" onClick={()=>handleLocalDataParsing(entry)}>
                        Process⚙️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded mx-1 ${
                page === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
                      <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md' onClick={()=> router.back()}>Cancel ❌</button>
    </div>
  );
};

export default Page;
