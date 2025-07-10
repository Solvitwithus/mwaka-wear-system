"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Types
const eastAfricanCountries = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "South Sudan"
];

const educationLevels = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other"
];

const candidateStatuses = [
  "Applied",
  "Under Review",
  "Interview Scheduled",
  "Offered",
  "Hired",
  "Rejected"
];

const generateCandidateCode = (prefix = "CAN", length = 4): string => {
  const random = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${random}${timestamp}`;
};

type Candidate = {
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
  graduationYear: string;
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
  const [candidate, setCandidate] = useState<Candidate>({
    candidateCode: generateCandidateCode(),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    jobId: "",
    designation: "",
    highestEducation: "",
    institution: "",
    graduationYear: "",
    workExperience: "",
    skills: "",
    coverLetter: "",
    resumeLink: "",
    applicationDate: new Date().toISOString().split("T")[0],
    status: "Applied",
  });

  const [jobs, setJobs] = useState<{ id: string; designation: string }[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // --- Fetch Approved Job Openings ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/auth/position-requisition");
        const approvedJobs = res.data.data.filter((job: any) => job.status === "approved");
        setJobs(approvedJobs);
      } catch {
        setError("Failed to fetch job openings.");
      }
    };

    fetchJobs();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCandidate((prev) => ({
      ...prev,
      [name]: name === "graduationYear" ? String(value) : value,
      ...(name === "jobId" && {
        designation: jobs.find((job) => job.id === value)?.designation || "",
      }),
    }));
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("/api/auth/add-candidate", candidate);
      if (res.status === 201) {
        
        
        setSuccess("✅ Candidate added successfully.");
        setCandidate({
          candidateCode: generateCandidateCode(),
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          address: "",
          jobId: "",
          designation: "",
          highestEducation: "",
          institution: "",
          graduationYear: "",
          workExperience: "",
          skills: "",
          coverLetter: "",
          resumeLink: "",
          applicationDate: new Date().toISOString().split("T")[0],
          status: "Applied",
        });
      }
    } catch {
      setError("❌ Failed to add candidate.");
    }
  };

  // --- Clear Success/Error Messages ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#265b3a]">Create Candidate</h4>
      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="border-black border-[1px] m-1 rounded-md flex justify-center gap-20 py-8">
          <div className="flex flex-col">
            {[
              { label: "Candidate Code:", name: "candidateCode", readOnly: true },
              { label: "First Name:", name: "firstName" },
              { label: "Last Name:", name: "lastName" },
              { label: "Email:", name: "email", type: "email" },
              { label: "Phone:", name: "phone", type: "tel" },
              { label: "City:", name: "city" },
              { label: "Address:", name: "address" },
              { label: "Resume Link:", name: "resumeLink", type: "url" },
              { label: "Graduation Year:", name: "graduationYear", type: "date" },
            ].map(({ label, name, readOnly = false, type = "text" }) => (
              <div className="flex justify-end gap-2 mb-1" key={name}>
                <label className="text-sm text-black">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(candidate as any)[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  className="bg-[#D9D9D9] h-6 rounded-md pl-2"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Country:</label>
              <select name="country" value={candidate.country} onChange={handleChange}>
                <option value="">-- Select Country --</option>
                {eastAfricanCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Job Applied For:</label>
              <select name="jobId" value={candidate.jobId} onChange={handleChange}>
                <option value="">-- Select Job --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.designation}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Highest Education:</label>
              <select name="highestEducation" value={candidate.highestEducation} onChange={handleChange}>
                <option value="">-- Select Education --</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Institution:</label>
              <input
                type="text"
                name="institution"
                value={candidate.institution}
                onChange={handleChange}
                className="bg-[#D9D9D9] h-6 rounded-md pl-2"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Skills:</label>
              <textarea
                name="skills"
                value={candidate.skills}
                onChange={handleChange}
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2"
                placeholder="e.g., JavaScript, Project Management, Communication"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Work Experience:</label>
              <textarea
                name="workExperience"
                value={candidate.workExperience}
                onChange={handleChange}
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2"
                placeholder="e.g., Software Engineer at XYZ Corp (2020-2023)"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Cover Letter:</label>
              <textarea
                name="coverLetter"
                value={candidate.coverLetter}
                onChange={handleChange}
                rows={3}
                className="bg-[#D9D9D9] rounded-md pl-2"
                placeholder="Brief cover letter or motivation statement"
              />
            </div>

            <div className="flex justify-end gap-2 mb-1">
              <label className="text-sm text-black">Status:</label>
              <select name="status" value={candidate.status} onChange={handleChange}>
                <option value="">-- Select Status --</option>
                {candidateStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md"
        >
          ➕ Add Candidate
        </button>
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
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default Page;