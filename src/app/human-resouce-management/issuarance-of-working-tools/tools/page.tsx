"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

const Page = () => {
  const router = useRouter();
  const [candidateData, setCandidateData] = useState<Candidate | null>(null);
  const [toolsRequired, setToolsRequired] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("entry");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCandidateData(parsed);
      } catch (error) {
        console.error("Error parsing candidate data from localStorage:", error);
      }
    }
  }, []);

  const handleApprove = async () => {
    try {
      if (!candidateData) return;
      const res = await axios.patch(`/api/auth/add-candidate/${candidateData.id}`, {
        toolsRequired, // Include tools in the PATCH request
      });
      if (res.status === 200) {
        localStorage.removeItem("entry"); // Clear localStorage after approval
        router.back();
      }
    } catch (err) {
      alert("Failed to approve candidate.");
    }
  };

  const handleToolsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setToolsRequired(e.target.value);
  };

  return (
    <div className="p-4">
      {candidateData ? (
        <div className="bg-white p-4 rounded-md shadow-md space-y-6">
          {/* Candidate Info */}
          <h2 className="text-left text-md font-serif font-bold mb-2">
            Candidate Approval for Application: {candidateData.candidateCode}
          </h2>
          <div className="border border-gray-300 p-3 rounded-md">
            <h2 className="text-center text-md font-bold mb-2">Candidate Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Candidate Code</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.candidateCode || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={`${candidateData.firstName} ${candidateData.lastName}` || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.email || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.phone || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Country</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.country || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">City</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.city || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Address</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.address || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Designation</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.designation || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Highest Education</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.highestEducation || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Institution</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.institution || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Graduation Year</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.graduationYear || ""}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Application Date</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={
                    candidateData.applicationDate
                      ? new Date(candidateData.applicationDate).toLocaleDateString()
                      : ""
                  }
                />
              </div>
              <div className="flex gap-1 justify-end">
                <label className="text-sm text-gray-600">Resume Link</label>
                <input
                  readOnly
                  className="w-full h-5 bg-gray-100 rounded px-2 py-1"
                  value={candidateData.resumeLink || ""}
                />
              </div>
            </div>
          </div>

          {/* Additional Info Table */}
          <div className="border border-gray-300 p-3 rounded-md">
            <h2 className="text-md font-bold mb-2">Additional Information</h2>
            <table className="w-full table-auto text-sm border border-gray-400">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="border px-2 py-1">Skills</th>
                  <th className="border px-2 py-1">Work Experience</th>
                  <th className="border px-2 py-1">Cover Letter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border px-2 py-1">{candidateData.skills || "-"}</td>
                  <td className="border px-2 py-1">{candidateData.workExperience || "-"}</td>
                  <td className="border px-2 py-1">{candidateData.coverLetter || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tools Required */}
          <div className="border border-gray-300 p-3 rounded-md">
            <h2 className="text-md font-bold mb-2">Tools Required</h2>
            <div className="flex gap-1 justify-end">
              <label className="text-sm text-gray-600">Tools Needed:</label>
              <textarea
                className="w-full bg-gray-100 rounded px-2 py-1"
                rows={4}
                value={toolsRequired}
                onChange={handleToolsChange}
                placeholder="e.g., Laptop, Software Licenses, Access to CRM System"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md font-semibold"
            >
              Approve Candidate
            </button>
            <button
              onClick={() => router.back()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading candidate data...</p>
      )}
    </div>
  );
};

export default Page;