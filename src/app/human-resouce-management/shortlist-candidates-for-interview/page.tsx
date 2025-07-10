"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- Types ---
type Candidate = {
  id: string;
  candidateCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  jobId: string;
  designation: string;
  highestEducation: string;
  institution: string;
  graduationYear: number;
  workExperience: string;
  skills: string;
  coverLetter: string;
  resumeLink: string;
  applicationDate: string;
  status: string;
};

// --- Component ---
const Page = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchDesignation, setSearchDesignation] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("/api/auth/add-candidate");
        const data = res.data.data || [];
        // Filter for candidates with status "Applied"
        const appliedCandidates = data.filter((candidate: Candidate) => candidate.status === "Applied");
        setCandidates(appliedCandidates);
        setFilteredCandidates(appliedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = candidates.filter((entry) => {
      const designationMatch = entry.designation
        ?.toLowerCase()
        .includes(searchDesignation.toLowerCase()) ?? true;
      const nameMatch = `${entry.firstName} ${entry.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase()) ?? true;

      return designationMatch && nameMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredCandidates(filtered);
    setPage(1); // Reset page on filter change
  }, [searchDesignation, searchName, sortOrder, candidates]);

  const paginatedCandidates = filteredCandidates.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

  const handleLocalDataParsing = async (entry: Candidate) => {
    try {
      const res = await axios.patch(`/api/auth/add-candidate/${entry.id}`, {
        status: "Shortlisted",
      });
      // Update local state after successful patch
      setCandidates((prev) =>
        prev.map((item) =>
          item.id === entry.id ? { ...item, status: "Shortlisted" } : item
        )
      );
      setFilteredCandidates((prev) =>
        prev.map((item) =>
          item.id === entry.id ? { ...item, status: "Shortlisted" } : item
        )
      );
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Review Candidate Applications</h4>

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
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
                <th className="p-2 border">Candidate Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Designation</th>
                <th className="p-2 border">Highest Education</th>
                <th className="p-2 border">Application Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">{entry.candidateCode || "-"}</td>
                    <td className="p-1 border">{`${entry.firstName} ${entry.lastName}` || "-"}</td>
                    <td className="p-1 border">{entry.email || "-"}</td>
                    <td className="p-1 border">{entry.phone || "-"}</td>
                    <td className="p-1 border">{entry.designation || "-"}</td>
                    <td className="p-1 border">{entry.highestEducation || "-"}</td>
                    <td className="p-1 border">
                      {entry.applicationDate
                        ? new Date(entry.applicationDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 border">{entry.status || "-"}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleLocalDataParsing(entry)}
                      >
                        ShortList✅
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