"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// --- Types ---
type SalesEntryItem = {
  itemName: string;
  quantity: number;
};

type DeliveryDetail = {
  destination?: string;
  
deliveryDate?: string;
  customerReference?: string;
};

type Client = {
  customerName?: string;
  branchName?:string

};

type SalesEntry = {
  id: string;
  client: Client;
  deliveryDetails?: DeliveryDetail;
  salesEntryItems: SalesEntryItem[];
  branchName?: string;
  saleDate: string;
  dueDate?: string;
  status: string;
  grandTotal: number;
  shipping: number;
};

// --- Component ---
const Page = () => {
const router = useRouter()
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<SalesEntry[]>([]);
  const [searchRef, setSearchRef] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/auth/sales-entry");
        const data = res.data.data || [];
        console.log("Fetched sales:", data);
        setSalesEntries(data);
        setFilteredEntries(data);
      } catch (error) {
        console.error("Error fetching sales entries:", error);
      }
    };

    fetchSales();
  }, []);

  // --- Filter + Sort ---
useEffect(() => {
  let filtered = salesEntries.filter((entry) => {
    if (entry.status !== "To-Deliver") return false; // filter first

    const refMatch =
      entry.deliveryDetails?.customerReference
        ?.toLowerCase()
        .includes(searchRef.toLowerCase()) ?? true;

    const branchMatch =
      entry.client?.branchName
        ?.toLowerCase()
        .includes(searchBranch.toLowerCase()) ?? true;

    const destMatch =
      entry.deliveryDetails?.destination
        ?.toLowerCase()
        .includes(searchDestination.toLowerCase()) ?? true;

    return refMatch && branchMatch && destMatch;
  });

  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.saleDate).getTime();
    const dateB = new Date(b.saleDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  setFilteredEntries(filtered);
  setPage(1);
}, [searchRef, searchBranch, searchDestination, sortOrder, salesEntries]);

  const paginatedEntries = filteredEntries.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
const handleLocalDataParsing = (entry: any) => {

  localStorage.setItem("saleEntryData", JSON.stringify(entry));
router.push("/transport/vehicle-loading/select-delivery-team")
  setTimeout(() => {
    
    localStorage.removeItem("saleEntryData");
  }, 1000*300);
};

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">OffLoading Form</h4>

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
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
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
                <th className="p-2 border">Customer Ref</th>
                <th className="p-2 border">Customer Name</th>
                <th className="p-2 border">Branch Name</th>
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
                      {entry.deliveryDetails?.customerReference || "-"}
                    </td>
                    <td className="p-1 border">
                      {entry.client?.customerName || "-"}
                    </td>
                    <td className="p-1 border">{entry.client.branchName || "-"}</td>
                    <td className="p-2 border">
                      {entry.deliveryDetails?.destination || "-"}
                    </td>
                    <td className="p-1 border">
                      {new Date(entry.saleDate).toLocaleDateString()}
                    </td>
                    <td className="p-1 border">
                      {entry.deliveryDetails?.deliveryDate
                        ? new Date(entry.deliveryDetails.deliveryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.grandTotal}</td>
                    <td className="p-1 border">{entry.shipping}</td>
                    <td className="p-1 border">
                      {entry.salesEntryItems?.[0]?.itemName || "-"}
                    </td>
                    <td className="p-1 border">
                      {entry.salesEntryItems?.[0]?.quantity || "-"}
                    </td>
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
