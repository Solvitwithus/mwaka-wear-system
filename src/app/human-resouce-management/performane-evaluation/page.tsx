"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LucideCheckCircle } from 'lucide-react';

// --- Types ---
type Employee = {
  id: string;
  userName: string;
  email: string;
  roleId: string;
  branch: string;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  description: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
};

type SkillRating = {
  skill: string;
  rating: number;
  comments: string;
};

type PerformanceEvaluation = {
  employeeId: string;
  evaluationDate: string;
  evaluationTime: string;
  department: string;
  skills: SkillRating[];
  overallFeedback: string;
  goals: string;
  status: string;
};

// --- Role-based Skills ---
const roleSkills: { [key: string]: string[] } = {
  "Driver": [
    "Safe Driving Practices",
    "Vehicle Maintenance Knowledge",
    "Route Planning",
    "Time Management",
    "Customer Interaction",
  ],
  "Cashier": [
    "Cash Handling Accuracy",
    "Customer Service",
    "Point of Sale System Proficiency",
    "Transaction Speed",
    "Inventory Awareness",
  ],
  "Human Resource Officer": [
    "Recruitment Process Management",
    "Employee Relations",
    "Policy Implementation",
    "Conflict Resolution",
    "Training Coordination",
  ],
  "Finance": [
    "Financial Reporting",
    "Budget Management",
    "Data Analysis",
    "Compliance Knowledge",
    "Accounting Software Proficiency",
  ],
  "Trifter": [
    "Inventory Sorting",
    "Quality Control",
    "Operational Efficiency",
    "Team Coordination",
    "Safety Compliance",
  ],
};

// --- Component ---
const PerformanceEvaluationForm = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [skills, setSkills] = useState<SkillRating[]>([]);
  const [overallFeedback, setOverallFeedback] = useState<string>("");
  const [goals, setGoals] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [hrUsers, setHrUsers] = useState<Employee[]>([]);
  const [approver, setApprover] = useState<string>("");

  // --- Fetch Employees and HR Users ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all employees
        const employeeRes = await axios.get("/api/auth/user-detail");
        const employeeData = employeeRes.data || [];
        console.log("Employees:", employeeData);
        setEmployees(employeeData);

        // Fetch HR users
        const userRes = await axios.get("/api/auth/user-detail");
        const users = userRes.data || [];
        console.log("All users:", users);

        const hrUsers = users.filter(
          (user: Employee) => user.role?.name === "Human Resource Officer"
        );
    

        console.log("HR users filtered:", hrUsers);
        setHrUsers(hrUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch employees or HR users.");
      }
    };

    fetchData();
  }, []);

  // --- Update Skills Based on Selected Employee ---
  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find((emp) => emp.id === selectedEmployee);
      if (employee) {
        setDepartment(employee.branch || "");
        const roleName = employee.role?.name || "";
        const skillsForRole = roleSkills[roleName] || ["General Skill 1", "General Skill 2"];
        setSkills(
          skillsForRole.map((skill) => ({
            skill,
            rating: 0,
            comments: "",
          }))
        );
      }
    } else {
      setDepartment("");
      setSkills([]);
    }
  }, [selectedEmployee, employees]);

  // --- Handle Skill Rating and Comments Change ---
  const handleSkillChange = (index: number, field: "rating" | "comments", value: string | number) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !approver) {
      setError("Please select an employee and an approver.");
      return;
    }

    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toISOString().split("T")[1].split(".")[0];
      const payload: PerformanceEvaluation = {
        employeeId: selectedEmployee,
        evaluationDate: currentDate,
        evaluationTime: currentTime,
        department,
        skills,
        overallFeedback,
        goals,
        status: "pending",
      };

      await axios.post("/api/auth/performance-evaluation", payload);
     
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setError("Failed to submit performance evaluation.");
    }
  };

  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-1 h-fit">
      <h4 className="text-black font-medium text-base ml-1">Performance Evaluation Form</h4>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}

      <div className="flex flex-col border-black border-[1px] p-2 space-y-2 rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee and Approver Selection */}
          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-2 py-1 border-[1px] border-black text-green-800 text-xs bg-[#D9D9D9] h-6 rounded-md w-1/3"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option value={emp.id} key={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.role?.name})
                </option>
              ))}
            </select>

            <select
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              className="px-2 py-1 border-[1px] border-black text-green-800 text-xs bg-[#D9D9D9] h-6 rounded-md w-1/3"
            >
              <option value="">Select Approver</option>
              {hrUsers.map((val) => (
                <option value={val.id} key={val.id}>
                  {val.firstName} {val.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-sm font-medium text-black">Branch</label>
            <input
              type="text"
              value={department}
              readOnly
              className="w-3/4 px-2 py-1 border-[1px] border-black text-green-800 text-xs bg-[#D9D9D9] h-6 rounded-md"
            />
          </div>

          {/* Skills Evaluation */}
          <div>
            <h5 className="text-sm font-medium text-black">Skills Evaluation</h5>
            {skills.length === 0 ? (
              <p className="text-sm text-gray-600">Select an employee to view skills.</p>
            ) : (
              skills.map((skill, index) => (
                <div key={index} className="flex flex-col gap-2 mb-2">
                  <label className="text-sm font-medium text-black">{skill.skill}</label>
                  <div className="flex gap-4">
                    <select
                      value={skill.rating}
                      onChange={(e) => handleSkillChange(index, "rating", Number(e.target.value))}
                      className="px-2 py-1 border-[1px] border-black text-green-800 text-xs bg-[#D9D9D9] h-6 rounded-md w-1/4"
                    >
                      <option value={0}>Select Rating</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}/5
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Comments"
                      value={skill.comments}
                      onChange={(e) => handleSkillChange(index, "comments", e.target.value)}
                      className="px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] h-6 rounded-md w-3/4"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Overall Feedback */}
          <div>
            <label className="text-sm font-medium text-black">Overall Feedback</label>
            <textarea
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              placeholder="Provide overall feedback"
              className="w-3/4 px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] rounded-md"
              rows={4}
            />
          </div>

          {/* Goals */}
          <div>
            <label className="text-sm font-medium text-black">Goals</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Set goals for the employee"
              className="w-3/4 px-2 py-1 border-[1px] border-black text-green-800 placeholder-black text-xs bg-[#D9D9D9] rounded-md"
              rows={4}
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#1393AB] text-white px-3 py-1 rounded text-xs flex items-center gap-1"
            >
              Submit Evaluation <LucideCheckCircle size={16} />
            </button>
            <button
              type="button"
              className="bg-[#E75D5D] text-sm px-3 py-1 font-semibold text-white rounded-md"
              onClick={() => router.back()}
            >
              Cancel ❌
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceEvaluationForm;