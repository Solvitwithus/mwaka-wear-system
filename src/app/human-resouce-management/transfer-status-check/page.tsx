"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LucideCheckCircle, LucideXCircle } from 'lucide-react';

// --- Types ---
type TransferRequest = {
  id: string;
  employeeId: string;
  transferReason: string;
  transferDate: string;
  transferInterview: string;
  knowledgeTransferPlan: string;
  document: File | null;
  status: string;
  approver?: string;
};

type Role = {
  name: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
};

// --- Component ---
const ApproveTransferPage = () => {
  const router = useRouter();
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TransferRequest[]>([]);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchReason, setSearchReason] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [approvers, setApprovers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;
  const [statusMap, setStatusMap] = useState<{ [key: string]: string }>({});

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transfer requests
        const transferRes = await axios.get("/api/auth/transfer-request");
        const transferData = transferRes.data || [];
        console.log("Raw transfer requests:", transferData);

        // Filter for pending transfer requests
        const pendingRequests = transferData.filter(
          (req: TransferRequest) => req.status !== "approved" && req.status !== "rejected"
        );
        console.log("Pending requests:", pendingRequests);

        setTransferRequests(pendingRequests);
        setFilteredRequests(pendingRequests);

        // Fetch approvers (Administrators and Human Resource Officers)
        const userRes = await axios.get("/api/auth/user-detail");
        const userData = userRes.data || [];
        const filteredApprovers = userData.filter(
          (user: User) => user.role?.name === "administrator" || user.role?.name === "Human Resource Officer"
        );
        console.log("Approvers:", filteredApprovers);
        setApprovers(filteredApprovers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch transfer requests or approvers.");
      }
    };

    fetchData();
  }, []);

  console.log("Approvers:", approvers);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = transferRequests.filter((entry) => {
      const employeeIdMatch = entry.employeeId
        ?.toLowerCase()
        .includes(searchEmployeeId.toLowerCase()) ?? true;
      const reasonMatch = entry.transferReason
        ?.toLowerCase()
        .includes(searchReason.toLowerCase()) ?? true;

      return employeeIdMatch && reasonMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.transferDate).getTime();
      const dateB = new Date(b.transferDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    console.log("Filtered requests:", filtered);
    setFilteredRequests(filtered);
    setPage(1); // Reset page on filter change
  }, [searchEmployeeId, searchReason, sortOrder, transferRequests]);

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  // --- Handle Status Change ---
  const handleStatusChange = (id: string, status: string) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
  };

  // --- Approve/Reject Transfer Request ---
  const handleProcessTransfer = async (entry: TransferRequest) => {
    try {
      const selectedStatus = statusMap[entry.id] || "approved";
      const selectedApprover = approvers.find(
        (approver) => `${approver.firstName} ${approver.lastName}` === entry.approver
      );

      const payload = {
        id: entry.id,
        status: selectedStatus,
        approver: selectedApprover ? `${selectedApprover.firstName} ${selectedApprover.lastName}` : "",
      
      };

      await axios.patch("/api/auth/transfer-request", payload);

      // Update local state
      setTransferRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
      setFilteredRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
    } catch (error) {
      console.error("Error processing transfer request:", error);
      setError("Failed to process transfer request.");
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Approve Transfer Requests</h4>
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
                <th className="p-2 border">Transfer Reason</th>
                <th className="p-2 border">Transfer Date</th>
                <th className="p-2 border">Transfer Interview</th>
                <th className="p-2 border">Knowledge Transfer Plan</th>
                <th className="p-2 border">Approver</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    No pending transfer requests found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">{entry.employeeId || "-"}</td>
                    <td className="p-1 border">{entry.transferReason || "-"}</td>
                    <td className="p-1 border">
                      {entry.transferDate
                        ? new Date(entry.transferDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.transferInterview || "-"}</td>
                    <td className="p-1 border">{entry.knowledgeTransferPlan || "-"}</td>
                    <td className="p-1 border">
                      <select
                        value={entry.approver || ""}
                        onChange={(e) => {
                          const updatedRequests = transferRequests.map((req) =>
                            req.id === entry.id ? { ...req, approver: e.target.value } : req
                          );
                          setTransferRequests(updatedRequests);
                          setFilteredRequests(updatedRequests.filter((req) =>
                            req.employeeId?.toLowerCase().includes(searchEmployeeId.toLowerCase()) &&
                            req.transferReason?.toLowerCase().includes(searchReason.toLowerCase())
                          ));
                        }}
                        className="border p-1"
                      >
                        <option value="">Select Approver</option>
                        {approvers.map((val) => (
                          <option value={`${val.firstName} ${val.lastName}`} key={val.id}>
                            {val.firstName} {val.lastName} ({val.role?.name})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1 border">
                      <select
                        value={statusMap[entry.id] || "approved"}
                        onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                        className="border p-1"
                      >
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-1 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        onClick={() => handleProcessTransfer(entry)}
                      >
                        {statusMap[entry.id] === "rejected" ? "Reject" : "Approve"} {statusMap[entry.id] === "rejected" ? <LucideXCircle size={16} /> : <LucideCheckCircle size={16} />}
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

export default ApproveTransferPage;