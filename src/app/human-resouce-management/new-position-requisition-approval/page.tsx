"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- Types ---
type PositionRequisition = {
  id: string;
  jobDescription: string;
  reasonForRequisition: string;
  designation: string;
  priority: string;
  department: string;
  contractType: string;
  dueDate: string;
  status: string;
  numberOfPositions: number;
};

// --- Component ---
const Page = () => {
  const router = useRouter();
  const [requisitions, setRequisitions] = useState<PositionRequisition[]>([]);
  const [filteredRequisitions, setFilteredRequisitions] = useState<PositionRequisition[]>([]);
  const [searchDesignation, setSearchDesignation] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const res = await axios.get("/api/auth/position-requisition");
        const data = res.data.data || [];
        setRequisitions(data);
        setFilteredRequisitions(data);
      } catch (error) {
        console.error("Error fetching position requisitions:", error);
      }
    };

    fetchRequisitions();
  }, []);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = requisitions.filter((entry) => {
      const designationMatch = entry.designation
        ?.toLowerCase()
        .includes(searchDesignation.toLowerCase()) ?? true;
      const departmentMatch = entry.department
        ?.toLowerCase()
        .includes(searchDepartment.toLowerCase()) ?? true;
      const statusMatch = entry.status
        ?.toLowerCase()
        .includes(searchStatus.toLowerCase()) ?? true;

      return designationMatch && departmentMatch && statusMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredRequisitions(filtered);
    setPage(1); // Reset page on filter change
  }, [searchDesignation, searchDepartment, searchStatus, sortOrder, requisitions]);

  const paginatedRequisitions = filteredRequisitions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRequisitions.length / rowsPerPage);

  const handleLocalDataParsing = async (entry: PositionRequisition) => {
    try {
      const res = await axios.patch(`/api/auth/position-requisition/${entry.id}`, {
        status: "approved",
      });
      // Update local state after successful patch
      setRequisitions((prev) =>
        prev.map((item) =>
          item.id === entry.id ? { ...item, status: "approved" } : item
        )
      );
      setFilteredRequisitions((prev) =>
        prev.map((item) =>
          item.id === entry.id ? { ...item, status: "approved" } : item
        )
      );
    } catch (error) {
      console.error("Error updating requisition status:", error);
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Review Position Requisitions</h4>

      {/* Filters */}
      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <div className="flex gap-4 justify-end flex-wrap">
          <input
            type="text"
            placeholder="Search by Designation"
            value={searchDesignation}
            onChange={(e) => setSearchDesignation(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Department"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
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
                <th className="p-2 border">Designation</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Contract Type</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">Number of Positions</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedRequisitions.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">{entry.designation || "-"}</td>
                    <td className="p-1 border">{entry.department || "-"}</td>
                    <td className="p-1 border">{entry.contractType || "-"}</td>
                    <td className="p-1 border">{entry.priority || "-"}</td>
                    <td className="p-1 border">
                      {entry.dueDate
                        ? new Date(entry.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.numberOfPositions || "-"}</td>
                    <td className="p-1 border">{entry.status || "-"}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text盒"
                        onClick={() => handleLocalDataParsing(entry)}
                      >
                        Approve✅
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
      <button
        className="bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md"
        onClick={() => router.back()}
      >
        Cancel ❌
      </button>
    </div>
  );
};

export default Page;