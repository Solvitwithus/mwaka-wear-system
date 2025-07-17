"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LucideCheckCircle } from 'lucide-react';

// --- Types ---
type LeaveApplication = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  branch: string;
  phone: string;
  leaveType: string;
  leaveBalance: number;
  applicationDate: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  remarks: string | null;
  status: string;
  approver?: string;
};

type User = {
  id: string;
  userName: string;
  email: string;
  roleId: string;
  branch: string;
   firstName:  String;
  lastName :  String;
  phone1: string;
  phone2: string;
  description: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  // Include other fields if needed
};

// --- Component ---
const LeaveApprovalPage = () => {
  const router = useRouter();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LeaveApplication[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchLeaveType, setSearchLeaveType] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hrUsers, setHrUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("hi");
        
       
        const leaveRes = await axios.get("/api/auth/leave-appliation");
        const leaveData = leaveRes.data || [];
        console.log("Raw leave applications:", leaveData); // Debug log

        // Filter for pending leave applications
        const pendingApplications = leaveData.filter(
          (app: LeaveApplication) => app.status === "Approved"
        );
        console.log("Pending applications:", pendingApplications); // Debug log

        setLeaveApplications(pendingApplications);
        setFilteredApplications(pendingApplications);

        // Fetch HR users
        const userRes = await axios.get("/api/auth/user-detail");
  const users = userRes.data; // This is the array of users
console.log("All users:", users);

const hrUsers = users.filter(
  (user: User) => ["administrator", "garding"].includes(user.role?.name)
);
console.log("HR users filtered:", hrUsers);
setHrUsers(hrUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch leave applications or HR users.");
      }
    };

    fetchData();
  }, []);
 console.log("HR users:", hrUsers); // Debug log


 
  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = leaveApplications.filter((entry) => {
      const nameMatch = `${entry.firstName} ${entry.lastName}`
        ?.toLowerCase()
        .includes(searchName.toLowerCase()) ?? true;
      const leaveTypeMatch = entry.leaveType
        ?.toLowerCase()
        .includes(searchLeaveType.toLowerCase()) ?? true;

      return nameMatch && leaveTypeMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    console.log("Filtered applications:", filtered); // Debug log
    setFilteredApplications(filtered);
    setPage(1); // Reset page on filter change
  }, [searchName, searchLeaveType, sortOrder, leaveApplications]);

  const paginatedApplications = filteredApplications.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

const [approver, setApprover] = useState("");


  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  // --- Approve Leave ---
  const handleApproveLeave = async (entry: LeaveApplication) => {
    try {
      
      await axios.patch("/api/auth/leave-appliation", {
        id: entry.id,
        status: "Application Processed",
        finalApprover: approver,
      });

      // Update local state
      setLeaveApplications((prev) =>
        prev.filter((app) => app.id !== entry.id)
      );
      setFilteredApplications((prev) =>
        prev.filter((app) => app.id !== entry.id)
      );
    } catch (error) {
      console.error("Error approving leave:", error);
      setError("Failed to approve leave application.");
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Leave Approval</h4>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <div className="flex gap-4 justify-end flex-wrap">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Leave Type"
            value={searchLeaveType}
            onChange={(e) => setSearchLeaveType(e.target.value)}
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
              
                <th className="p-2 border">Name</th>
                
                <th className="p-2 border">Leave Type</th>
                <th className="p-2 border">Leave Balance</th>
                <th className="p-2 border">Application Date</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Leave Days</th>
                <th className="p-2 border">Remarks</th>
                <th className="p-2 border">Approver</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={15} className="text-center p-4">
                    No pending leave applications found.
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                   
                    <td className="p-1 border">{`${entry.firstName} ${entry.lastName}` || "-"}</td>
               
                    <td className="p-1 border">{entry.leaveType || "-"}</td>
                    <td className="p-1 border">{entry.leaveBalance || "-"}</td>
                    <td className="p-1 border">
                      {entry.applicationDate
                        ? new Date(entry.applicationDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">
                      {entry.startDate
                        ? new Date(entry.startDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">
                      {entry.endDate
                        ? new Date(entry.endDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.leaveDays || "-"}</td>
                    <td className="p-1 border">{entry.remarks || "-"}</td>
<td className="p-1 border">
  <select value={approver} onChange={(e) => setApprover(e.target.value)} className="border p-1">
    <option>Select Approver</option>
    {hrUsers.map((val) => (
      <option value={val.id} key={val.id}>
        {val.firstName} {val.lastName}
      </option>
    ))}
  </select>
</td>

                    <td className="p-1 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        onClick={() => handleApproveLeave(entry)}
                      >
                        Approve <LucideCheckCircle size={16} />
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

export default LeaveApprovalPage;