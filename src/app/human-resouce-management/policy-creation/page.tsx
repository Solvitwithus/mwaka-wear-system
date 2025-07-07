"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

type Department = {
  departmentName: string;
};

type Branch = {
  branchCode: string;
  name: string;
};

type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone1: string;
  roleId: string;
};

type Policy = {
  policyTitle: string;
  code: string;
  policyCategory: string;
  effectiveDate: string;
  purpose: string;
  scope: string;
  policyRules: string;
  consequences: string;
  applicableDepartments: string[];
  applicableBranches: string[];
  rolesAffected: string;
  comment: string;
};

const generatePolicyCode = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `POL${random}${timestamp}`;
};

const Page = () => {
  const router = useRouter();

  const [policy, setPolicy] = useState<Policy>({
    policyTitle: "",
    code: "",
    policyCategory: "",
    effectiveDate: "",
    purpose: "",
    scope: "",
    policyRules: "",
    consequences: "",
    applicableDepartments: [],
    applicableBranches: [],
    rolesAffected: "",
    comment: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [deptRes, branchRes, userRes] = await Promise.all([
        axios.get("/api/auth/create-department"),
        axios.get("/api/auth/addbranch"),
        axios.get("/api/auth/user"),
      ]);
      setDepartments(deptRes.data);
      setBranches(branchRes.data);
      setUsers(userRes.data);
    } catch (err) {
      setError("Failed to fetch data.");
    }
  }, []);

  useEffect(() => {
    setPolicy((prev) => ({
      ...prev,
      code: generatePolicyCode(),
    }));
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((option) => option.value);
      setPolicy((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else {
      setPolicy((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/auth/create-policy", policy);
      if (res.status === 201) {
        setSuccess("Policy created successfully.");
        setPolicy({
          policyTitle: "",
          code: generatePolicyCode(),
          policyCategory: "",
          effectiveDate: "",
          purpose: "",
          scope: "",
          policyRules: "",
          consequences: "",
          applicableDepartments: [],
          applicableBranches: [],
          rolesAffected: "",
          comment: "",
        });
      }
    } catch {
      setError("Failed to create policy.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotify = async () => {
    try {
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      const phoneNumbers = users.map((user) => user.phone1).filter(Boolean);
      const notificationPayload = {
        policyTitle: policy.policyTitle,
        code: policy.code,
        message: `New Policy: ${policy.policyTitle} (${policy.code}) has been created.`,
        phoneNumbers,
        fcmToken: token,
      };

      await axios.post("/api/auth/notify-policy", notificationPayload);
      setSuccess("Notification sent successfully.");
    } catch (err) {
      setError("Failed to send notification.");
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
        Create Policy
      </h4>

      <form
        className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-36 py-8">
          {/* Left Column */}
          <div className="flex flex-col">
            {[
              { label: "Policy Code:", name: "code", readOnly: true },
              {
                label: "Policy Title:",
                name: "policyTitle",
                placeholder: "e.g. Remote Work Policy",
              },
              { label: "Effective Date:", name: "effectiveDate", type: "date" },
              {
                label: "Purpose:",
                name: "purpose",
                placeholder: "e.g. To ensure clear guidelines...",
                textarea: true,
              },
              {
                label: "Scope:",
                name: "scope",
                placeholder: "e.g. All employees",
                textarea: true,
              },
            ].map(({ label, name, placeholder, readOnly = false, textarea = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label htmlFor={name} className="text-sm text-black">
                  {label}
                </label>
                {textarea ? (
                  <textarea
                    name={name}
                    value={(policy as any)[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={4}
                    className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={(policy as any)[name]}
                    onChange={handleChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
                  />
                )}
              </div>
            ))}
                 <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="policyRules" className="text-sm text-black">
                Policy Rules:
              </label>
              <textarea
                name="policyRules"
                value={policy.policyRules}
                onChange={handleChange}
                placeholder="Enter policy rules..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="policyCategory" className="text-sm text-black">
                Policy Category:
              </label>
              <select
                name="policyCategory"
                value={policy.policyCategory}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
              >
                <option value="">Select category</option>
                {["Attendance", "Leave", "Conduct", "Security", "Dress Code", "Remote Work"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="applicableDepartments" className="text-sm text-black">
                Applicable Departments:
              </label>
              <select
                name="applicableDepartments"
                multiple
                value={policy.applicableDepartments}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-20 rounded-md w-36 pl-2 text-sm text-black"
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept.departmentName}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="applicableBranches" className="text-sm text-black">
                Applicable Branches:
              </label>
              <select
                name="applicableBranches"
                multiple
                value={policy.applicableBranches}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-20 w-36 rounded-md pl-2 text-sm text-black"
              >
                {branches.map((branch, idx) => (
                  <option key={idx} value={branch.branchCode}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="rolesAffected" className="text-sm text-black">
                Roles Affected:
              </label>
              <input
                type="text"
                name="rolesAffected"
                value={policy.rolesAffected}
                onChange={handleChange}
                placeholder="e.g. Manager, Staff"
                className="bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]"
              />
            </div>

       

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="consequences" className="text-sm text-black">
                Consequences:
              </label>
              <textarea
                name="consequences"
                value={policy.consequences}
                onChange={handleChange}
                placeholder="Enter consequences for violation..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label htmlFor="comment" className="text-sm text-black">
                Comment:
              </label>
              <textarea
                name="comment"
                value={policy.comment}
                onChange={handleChange}
                placeholder="Enter any comments..."
                rows={4}
                className="bg-[#D9D9D9] rounded-md pl-2 text-sm placeholder-[#e48383]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            ➕ Add Policy
          </button>
          <button
            type="button"
            onClick={handleNotify}
            disabled={isSubmitting}
            className={`bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            📢 Notify
          </button>
        </div>
      </form>

      <button
        className="bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md"
        type="button"
        onClick={() => router.back()}
      >
        ❌ Back
      </button>

      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default Page;