"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Grading = {
  branch: string;
  gradeReference: string;
  workCenter: string;
  gradeDate: string;
  baleName: string;
  grader: string;
  baleWeight: number;
  itemCount: number;
  status: string;
};

const Page = () => {
  const route = useRouter();
  const [gradeOrder, setGradeOrder] = useState<Grading[]>([]);
  const [filteredGradeOrder, setFilteredGradeOrder] = useState<Grading[]>([]);
  const [searchRef, setSearchRef] = useState("");
  const [searchBank, setSearchBank] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchGradingOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/grading-sheet");
      setGradeOrder(response.data);
    } catch (error) {
      console.error("Failed to get grading sheet:", error);
    }
  }, []);

  useEffect(() => {
    fetchGradingOrders();
  }, [fetchGradingOrders]);

  // 🔍 Apply filter and sort anytime filters or data changes
  useEffect(() => {
    const filtered = gradeOrder
      .filter((entry) => entry.status === "Thrift")
      .filter((entry) =>
        entry.gradeReference.toLowerCase().includes(searchRef.toLowerCase())
      )
      .filter((entry) =>
        entry.branch.toLowerCase().includes(searchBank.toLowerCase())
      )
      .filter((entry) =>
        entry.baleName.toLowerCase().includes(searchDestination.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.gradeDate).getTime() - new Date(b.gradeDate).getTime()
          : new Date(b.gradeDate).getTime() - new Date(a.gradeDate).getTime()
      );

    setFilteredGradeOrder(filtered);
  }, [gradeOrder, searchRef, searchBank, searchDestination, sortOrder]);

  const handlePrint = async (val: any) => {
    localStorage.setItem("printBarcodes", JSON.stringify(val));
    route.push("/thrift-processing/dispatch-to-branch/confirm-dispatch");

    setTimeout(() => {
      localStorage.removeItem("printBarcodes");
    }, 1000 * 200);
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h2 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
        Transit Processed Items
      </h2>

      {/* Search & Filters */}
      <div className="flex justify-end gap-1 mb-1">
        <input
          type="text"
          placeholder="Search by Grade Ref"
          value={searchRef}
          onChange={(e) => setSearchRef(e.target.value)}
          className="px-3 border w-48 border-gray-300 rounded-md text-sm"
        />
        <input
          type="text"
          placeholder="Search by Branch Name"
          value={searchBank}
          onChange={(e) => setSearchBank(e.target.value)}
          className="px-3 border w-48 border-gray-300 rounded-md text-sm"
        />
        <input
          type="text"
          placeholder="Search by Bale Name"
          value={searchDestination}
          onChange={(e) => setSearchDestination(e.target.value)}
          className="px-3 border w-48 border-gray-300 rounded-md text-sm"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="px-3 border w-48 border-gray-300 rounded-md text-sm"
        >
          <option value="desc">Sort by: Most Recent First</option>
          <option value="asc">Sort by: Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow overflow-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-[#1393AB] text-white">
            <tr>
              <th className="px-4 py-2 border">Branch Name</th>
              <th className="px-4 py-2 border">Grade Reference</th>
              <th className="px-4 py-2 border">Work Center</th>
              <th className="px-4 py-2 border">Grade Date</th>
              <th className="px-4 py-2 border">Bale Name</th>
              <th className="px-4 py-2 border">Item Count</th>
              <th className="px-4 py-2 border">Grader</th>
              <th className="px-4 py-2 border">Bale Weight</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGradeOrder.map((val) => (
              <tr key={val.gradeReference} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{val.branch}</td>
                <td className="px-4 py-2 border">{val.gradeReference}</td>
                <td className="px-4 py-2 border">{val.workCenter}</td>
                <td className="px-4 py-2 border">{val.gradeDate}</td>
                <td className="px-4 py-2 border">{val.baleName}</td>
                <td className="px-4 py-2 border">{val.itemCount}</td>
                <td className="px-4 py-2 border">{val.grader}</td>
                <td className="px-4 py-2 border">{val.baleWeight}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    type="button"
                    className="bg-[#1393AB] hover:bg-[#0f7b91] text-white px-3 py-1 rounded text-xs"
                    onClick={() => handlePrint(val)}
                  >
                    Dispatch 🚗
                  </button>
                </td>
              </tr>
            ))}
            {filteredGradeOrder.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No grading orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
