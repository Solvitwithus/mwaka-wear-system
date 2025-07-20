"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PromotionRequest {
  employeeId: string;
  promotionReason: string;
  promotionDate: string;
  promotionDetails: string;
  performanceReview: string;
  document: File | null;
}

type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
};

export default function PromotionRequestPage() {
  const [formData, setFormData] = useState<PromotionRequest>({
    employeeId: "",
    promotionReason: "",
    promotionDate: "",
    promotionDetails: "",
    performanceReview: "",
    document: null,
  });

  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("/api/auth/user-detail");
        setUsers(usersRes.data);
      } catch (err) {
        toast.error("Error fetching users");
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

      await axios.post("/api/auth/promotion-request", payload);

      toast.success("Promotion request submitted successfully!");
      setFormData({
        employeeId: "",
        promotionReason: "",
        promotionDate: "",
        promotionDetails: "",
        performanceReview: "",
        document: null,
      });
    } catch (err) {
      toast.error("Submission failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Employee Promotion Request</h1>
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

        {/* Promotion Reason Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Reason</label>
          <input
            type="text"
            name="promotionReason"
            value={formData.promotionReason}
            onChange={handleChange}
            required
            placeholder="Enter reason for promotion..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Promotion Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Date</label>
          <input
            type="date"
            name="promotionDate"
            value={formData.promotionDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Promotion Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Details</label>
          <textarea
            name="promotionDetails"
            value={formData.promotionDetails}
            onChange={handleChange}
            rows={4}
            placeholder="Summarize key details of the promotion..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Performance Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Review</label>
          <textarea
            name="performanceReview"
            value={formData.performanceReview}
            onChange={handleChange}
            rows={4}
            placeholder="Outline performance review details..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document (e.g., Promotion Recommendation Letter)</label>
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
            Submit Promotion Request
          </button>
        </div>
      </form>
    </div>
  );
}