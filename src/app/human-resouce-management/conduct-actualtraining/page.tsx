"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LucideCheckCircle } from 'lucide-react';

// --- Types ---
type TrainingRequest = {
  id: string;
  requestDate: string;
  requestTime: string;
  department: string;
  areaOfTraining: string;
  targetGroup: string;
  budget: number;
  startDate: string;
  endDate: string;
  remarks: string | null;
  status: string;
  trainer?: string;
};

type Trainer = {
  id: string;
  nationalId: string;
  fullName: string;
  email: string;
  phone1: string;
  phone2: string;
  website: string;
  gender: string;
  specialization: string;
  credentials: string[];
  experienceYears: number;
  languages: string[];
  trainerType: string;
  availability: string;
  ratePerSession: number;
  city: string;
  country: string;
  preferredMode: string;
  canTravel: boolean;
};

// --- Component ---
const ConductTrainingPage = () => {
  const router = useRouter();
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TrainingRequest[]>([]);
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchAreaOfTraining, setSearchAreaOfTraining] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved training requests
        const trainingRes = await axios.get("/api/auth/training-request");
        const trainingData = trainingRes.data || [];
        console.log("Raw training requests:", trainingData);

        // Filter for approved training requests
        const approvedRequests = trainingData.filter(
          (req: TrainingRequest) => req.status === "approved"
        );
        console.log("Approved requests:", approvedRequests);

        setTrainingRequests(approvedRequests);
        setFilteredRequests(approvedRequests);

        // Fetch trainers
        const trainerRes = await axios.get("/api/auth/create-trainer");
        const trainerData = trainerRes.data || [];
        console.log("Trainers:", trainerData);
        setTrainers(trainerData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch training requests or trainers.");
      }
    };

    fetchData();
  }, []);

  console.log("Trainers:", trainers);

  // --- Filter + Sort ---
  useEffect(() => {
    let filtered = trainingRequests.filter((entry) => {
      const departmentMatch = entry.department
        ?.toLowerCase()
        .includes(searchDepartment.toLowerCase()) ?? true;
      const areaOfTrainingMatch = entry.areaOfTraining
        ?.toLowerCase()
        .includes(searchAreaOfTraining.toLowerCase()) ?? true;

      return departmentMatch && areaOfTrainingMatch;
    });

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.requestDate).getTime();
      const dateB = new Date(b.requestDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    console.log("Filtered requests:", filtered);
    setFilteredRequests(filtered);
    setPage(1); // Reset page on filter change
  }, [searchDepartment, searchAreaOfTraining, sortOrder, trainingRequests]);

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const [trainer, setTrainer] = useState("");

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  // --- Mark Training as Conducted ---
  const handleConductTraining = async (entry: TrainingRequest) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toISOString().split("T")[1].split(".")[0];
      const payload = {
        id: entry.id,
        status: "Conducted",
        trainer,
        requestDate: currentDate,
        requestTime: currentTime,
        department: entry.department,
        areaOfTraining: entry.areaOfTraining,
        targetGroup: entry.targetGroup,
        budget: entry.budget,
        startDate: entry.startDate,
        endDate: entry.endDate,
        remarks: entry.remarks,
      };

      await axios.patch("/api/auth/training-request", payload);

      // Update local state
      setTrainingRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
      setFilteredRequests((prev) =>
        prev.filter((req) => req.id !== entry.id)
      );
    } catch (error) {
      console.error("Error marking training as conducted:", error);
      setError("Failed to mark training as conducted.");
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Conduct Training</h4>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <div className="flex gap-4 justify-end flex-wrap">
          <input
            type="text"
            placeholder="Search by Department"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
            className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Area of Training"
            value={searchAreaOfTraining}
            onChange={(e) => setSearchAreaOfTraining(e.target.value)}
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
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Area of Training</th>
                <th className="p-2 border">Target Group</th>
                <th className="p-2 border">Budget</th>
                <th className="p-2 border">Request Date</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Remarks</th>
                <th className="p-2 border">Trainer</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center p-4">
                    No approved training requests found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-1 border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-1 border">{entry.department || "-"}</td>
                    <td className="p-1 border">{entry.areaOfTraining || "-"}</td>
                    <td className="p-1 border">{entry.targetGroup || "-"}</td>
                    <td className="p-1 border">{entry.budget || "-"}</td>
                    <td className="p-1 border">
                      {entry.requestDate
                        ? new Date(entry.requestDate).toLocaleDateString()
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
                    <td className="p-1 border">{entry.remarks || "-"}</td>
                    <td className="p-1 border">
                      <select
                        value={trainer}
                        onChange={(e) => setTrainer(e.target.value)}
                        className="border p-1"
                      >
                        <option>Select Trainer</option>
                        {trainers.map((val) => (
                          <option value={val.id} key={val.id}>
                            {val.fullName} ({val.specialization})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1 border">
                      <button
                        className="bg-[#1393AB] text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        onClick={() => handleConductTraining(entry)}
                      >
                        Mark as Conducted <LucideCheckCircle size={16} />
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

export default ConductTrainingPage;