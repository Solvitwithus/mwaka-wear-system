"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LucideCheckCircle } from 'lucide-react';

// --- Types ---
type ExitRequest = {
  id: string;
  employeeId: string;
  reasonToExit: string;
  exitDate: string;
  exitInterview: string;
  knowledgeTransferPlan: string;
  document: File | null;
  status: string;
};

// --- Component ---
const EmployeeLeavePage = () => {
  const router = useRouter();
  const [exitRequests, setExitRequests] = useState<ExitRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ExitRequest[]>([]);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchReason, setSearchReason] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exit requests
        const exitRes = await axios.get("/api/auth/exit-request");
        const exitData = exitRes.data || [];
        console.log("Raw exit requests:", exitData);

        // Filter for approved exit requests
        const approvedRequests = exitData.filter(
          (req: ExitRequest) => req.status === "approved"
        );
        console.log("Approved requests:", approvedRequests);

        setExitRequests(approvedRequests);
        setFilteredRequests(approvedRequests);
      } catch (error) {
        console.error("Error fetching exit requests:", error);
        setError("Failed to fetch exit requests.");
      }
    };

    fetchData();
  }, []);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = exitRequests.filter((entry) => {
      const employeeIdMatch = entry.employeeId
        ?.toLowerCase()
        .includes(searchEmployeeId.toLowerCase()) ?? true;
      const reasonMatch = entry.reasonToExit
        ?.toLowerCase()
        .includes(searchReason.toLowerCase()) ?? true;

      return employeeIdMatch && reasonMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.exitDate).getTime();
      const dateB = new Date(b.exitDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    console.log("Filtered requests:", filtered);
    setFilteredRequests(filtered);
    setPage(1); // Reset page on filter change
  }, [searchEmployeeId, searchReason, sortOrder, exitRequests]);

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  // --- Mark Employee as Left ---
  const handleEmployeeLeft = async (entry: ExitRequest) => {
    try {
         const payload = {
        id: entry.id,
        status: "Employee-just-left",
        
      };

      await axios.patch("/api/auth/exit-request", payload);

      // Update local state
      setExitRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
      setFilteredRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
    } catch (error) {
      console.error("Error marking employee as left:", error);
      setError("Failed to mark employee as left.");
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Employee Leave</h4>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <div className="flex gap-4 justify-end flex-wrap">
          <input
            type="text"
            placeholder="Search by Employee ID"
            value={searchEmployeeId}
            onChange={(e) => setSearchEmployeeId(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Reason"
            value={searchReason}
            onChange={(e) => setSearchReason(e.target.value)}
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
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Reason to Exit</th>
                <th className="p-2 border">Exit Date</th>
                <th className="p-2 border">Exit Interview</th>
                <th className="p-2 border">Knowledge Transfer Plan</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    No approved exit requests found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">{entry.employeeId || "-"}</td>
                    <td className="p-1 border">{entry.reasonToExit || "-"}</td>
                    <td className="p-1 border">
                      {entry.exitDate
                        ? new Date(entry.exitDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.exitInterview || "-"}</td>
                    <td className="p-1 border">{entry.knowledgeTransferPlan || "-"}</td>
                    <td className="p-1 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        onClick={() => handleEmployeeLeft(entry)}
                      >
                        Mark as Left <LucideCheckCircle size={16} />
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

export default EmployeeLeavePage;