"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseJSON } from "date-fns";
// --- Types ---
type SalesEntryItem = {
  itemName: string;
  quantity: number;
  itemId:string;
  total:number;
  createdAt:string;

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
  grandTotal: number;
  shipping: number;
  status:string;
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
const [parsedData, setParsedData] = useState<JSX.Element | null>(null);
const [partialAllocations, setPartialAllocations] = useState<Record<string, number>>({});
  // --- Fetch Data ---



  useEffect(() => {
  const fetchSales = async () => {
    try {
      const res = await axios.get("/api/auth/prepaid-sales");
      const data = res.data.data || [];
      console.log("Fetched sales:", data);

      const parsed = data.map((entry: SalesEntry) => ({
        ...entry,
        saleDate: new Date(entry.saleDate),
        dueDate: entry.dueDate ? new Date(entry.dueDate) : undefined,
        salesEntryItems: entry.salesEntryItems.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })),
      }));

      setSalesEntries(parsed);
      setFilteredEntries(parsed);
    } catch (error) {
      console.error("Error fetching sales entries:", error);
    }
  };

  fetchSales();
}, []);


  // --- Filter + Sort ---
useEffect(() => {
   const allowedStatuses = ["New-sales-entry", "Direct-Sale","Prepayment-successful","Prepaid-entry-delivered-successfully"];

  let filtered = salesEntries.filter((entry) => {
    // Ensure status is allowed
    if (!allowedStatuses.includes(entry.status)) return false;

    // Perform search filters
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

  // Sort based on saleDate
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.saleDate).getTime();
    const dateB = new Date(b.saleDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  setFilteredEntries(filtered);
  setPage(1); // Reset page on filter change
}, [searchRef, searchBranch, searchDestination, sortOrder, salesEntries]);

  const paginatedEntries = filteredEntries.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);

  const handleAllocateAll = async (entry: SalesEntry) => {
  try {
    for (const item of entry.salesEntryItems) {
      await axios.post("/api/auth/prepayment", {
        salesEntryId: entry.id,
        itemId: item.itemId,
        total: item.total,
        allocateAll: item.total,
      });
    }
    alert("Allocated all successfully!");
  } catch (error) {
    console.error("Error allocating all:", error);
  }
};

const handlePartialAllocation = async (entry: SalesEntry) => {
  try {
    for (const item of entry.salesEntryItems) {
      const input = prompt(`Enter partial allocation for ${item.itemName}`);
      const value = parseFloat(input || "0");
      if (!isNaN(value) && value > 0) {
        await axios.patch("/api/auth/prepayment", {
          itemId: item.itemId,
          partialAllocation: value,
        });
      }
    }
    alert("Partial allocation submitted.");
  } catch (error) {
    console.error("Partial allocation error:", error);
  }
};

const handleDataParsing = (entry: SalesEntry) => {
  return (
    <div className="border w-[98%] border-red-600 z-50 absolute bg-slate-700 text-white top-1/3 left-5 p-4">
   

      <table className="w-full text-sm border-collapse border border-white">
     <thead>
  <tr className="bg-gray-800">
    <th>Ref Number</th>
    <th>Item ID</th>
    <th>Item Name</th>
    <th>Quantity</th>
    <th>Client</th>
    <th>Date</th>
    <th>Amount</th>
    <th>Shipping</th>

    <th
      className="text-green-500 text-xs cursor-pointer"
      onClick={() => handleAllocateAll(entry)}
    >
      Allocate All
    </th>
    <th
      className="text-green-500 text-xs cursor-pointer"
      onClick={() => handlePartialAllocation(entry)}
    >
      Partial Allocation
    </th>
    <th>Prev Allocation</th>
    <th>Bal</th>
  </tr>
</thead>

        <tbody>
          {entry.salesEntryItems.map((item, idx) => (
            <tr key={idx} className="border-t border-white">
              <td>{entry.deliveryDetails?.customerReference ?? "N/A"}</td>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.quantity}</td>
              <td>{entry.client?.customerName ?? "N/A"}</td>
              <td>{entry.saleDate.toString()}</td>
              <td>{item.total}</td>
              <td>{entry.shipping}</td>
              
              <td>
                <input type="number" className="w-16" disabled value={item.total}/>
              </td>
               <td>
  <input
    type="number"
    className="w-24"
    value={partialAllocations[item.itemId] || ""}
    onChange={(e) => {
      const value = parseFloat(e.target.value);
      setPartialAllocations((prev) => ({
        ...prev,
        [item.itemId]: isNaN(value) ? 0 : value,
      }));
    }}
    min={0}
    max={item.total} // Optional: restrict allocation to item total
    placeholder="Enter amount"
  />
</td>

                <td>
                <input type="number" className="w-16" disabled/>
               
              </td>
               <td>
                <input type="number" className="w-16" disabled/>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
         <button
        className="mb-1 bg-red-500 px-3 py-1 mt-1 rounded text-white"
        onClick={() => setParsedData(null)}
      >
        Close
      </button>


     
    </div>
  );
};


  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Resolve Prepaid Invoices</h4>

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
                      <button className="bg-[#1393AB]  text-white px-2 py-1 rounded text-xs" onClick={() => setParsedData(handleDataParsing(entry))}>
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
        {parsedData}
      </div>
                      <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md' onClick={()=> router.back()}>Cancel ❌</button>
    </div>
  );
};

export default Page;
