"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ExitRequest {
  employeeId: string;
  reasonToExit: string;
  exitDate: string;
  exitInterview: string;
  knowledgeTransferPlan: string;
  document: File | null; // Added
}

type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
};

type ExitReason = {
  reasonCode: string;
  reasonName: string;
};

export default function ExitRequestPage() {
  const [formData, setFormData] = useState<ExitRequest>({
    employeeId: "",
    reasonToExit: "",
    exitDate: "",
    exitInterview: "",
    knowledgeTransferPlan: "",
    document: null, // Added
  });

  const [users, setUsers] = useState<User[]>([]);
  const [exitReasons, setExitReasons] = useState<ExitReason[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, reasonsRes] = await Promise.all([
          axios.get("/api/auth/user-detail"),
          axios.get("/api/auth/create-exit-reason"),
        ]);

        setUsers(usersRes.data);

        if (Array.isArray(reasonsRes.data)) {
          setExitReasons(reasonsRes.data);
        } else {
          toast.error("Exit reasons must be an array");
        }
      } catch (err) {
        toast.error("Error fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, document: file }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    let documentUrl = null;

    if (formData.document) {
      const { uploadDocumentToSupabase } = await import('@/lib/uploadToSupabase');
      documentUrl = await uploadDocumentToSupabase(formData.document);
    }

    const payload = {
      ...formData,
      documentUrl,
    };

    await axios.post("/api/auth/exit-request", payload);


    toast.success("Exit request submitted successfully!");
   
  } catch (err) {
    toast.error("Submission failed");
    console.error(err);
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Employee Exit Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Employee --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Reason to Exit Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason to Exit</label>
          <select
            name="reasonToExit"
            value={formData.reasonToExit}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Reason --</option>
            {exitReasons.map((reason) => (
              <option key={reason.reasonCode} value={reason.reasonName}>
                {reason.reasonName}
              </option>
            ))}
          </select>
        </div>

        {/* Exit Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exit Date</label>
          <input
            type="date"
            name="exitDate"
            value={formData.exitDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Exit Interview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exit Interview Notes</label>
          <textarea
            name="exitInterview"
            value={formData.exitInterview}
            onChange={handleChange}
            rows={4}
            placeholder="Summarize key points from the interview..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Knowledge Transfer Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Transfer Plan</label>
          <textarea
            name="knowledgeTransferPlan"
            value={formData.knowledgeTransferPlan}
            onChange={handleChange}
            rows={4}
            placeholder="Outline steps for smooth handover..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document (e.g., Resignation Letter)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Exit Request
          </button>
        </div>
      </form>
    </div>
  );
}
