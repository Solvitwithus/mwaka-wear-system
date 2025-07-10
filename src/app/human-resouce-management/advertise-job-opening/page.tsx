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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchApprovedRequisitions = async () => {
      try {
        const res = await axios.get("/api/auth/position-requisition");
        const data = res.data.data || [];
        // Filter for approved positions only
        const approvedData = data.filter((entry: PositionRequisition) => entry.status === "approved");
        setRequisitions(approvedData);
        setFilteredRequisitions(approvedData);
      } catch (error) {
        console.error("Error fetching approved position requisitions:", error);
      }
    };

    fetchApprovedRequisitions();
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

      return designationMatch && departmentMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredRequisitions(filtered);
    setPage(1); // Reset page on filter change
  }, [searchDesignation, searchDepartment, sortOrder, requisitions]);

  const paginatedRequisitions = filteredRequisitions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRequisitions.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-[#1393AB] mb-6 flex items-center">
          <svg className="w-8 h-8 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Advertised Job Openings
        </h1>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end flex-wrap">
            <input
              type="text"
              placeholder="Search by Designation"
              value={searchDesignation}
              onChange={(e) => setSearchDesignation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Search by Department"
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="desc">Sort by: Most Recent First</option>
              <option value="asc">Sort by: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Job Openings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRequisitions.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No approved job openings found.</p>
            </div>
          ) : (
            paginatedRequisitions.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold text-gray-800">{entry.designation}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Advertised
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Department:</span> {entry.department || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Contract Type:</span> {entry.contractType || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Priority:</span> {entry.priority || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Application Deadline:</span>{" "}
                    {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Positions Available:</span>{" "}
                    {entry.numberOfPositions || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-sm">Description:</span>{" "}
                    {entry.jobDescription || "-"}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="w-full bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => router.push("/human-resouce-management/new-position-requisition-approval")}
                  >
                    View Job Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            onClick={() => router.back()}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;