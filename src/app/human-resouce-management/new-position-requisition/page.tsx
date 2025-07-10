'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/components/Tiptap'
import axios from 'axios'

interface Designation {
  titleName: string
}

interface Priority {
  priorityCode: string
  priorityName: string
}

interface Department {
  departmentName: string
  shortName: string
}

interface ContractType {
  contractCode: string
  contractName: string
}

const NewPositionRequisitionForm = () => {
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState<string>('')
  const [reasonForRequisition, setReasonForRequisition] = useState<string>('')
  const [designation, setDesignation] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [department, setDepartment] = useState<string>('')
  const [contractType, setContractType] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [numberOfPositions, setNumberOfPositions] = useState<string>('')
  const [designations, setDesignations] = useState<Designation[]>([])
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [contractTypes, setContractTypes] = useState<ContractType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [designationRes, priorityRes, departmentRes, contractTypeRes] = await Promise.all([
          fetch('/api/auth/create-designation'),
          fetch('/api/auth/create-priority-level'),
          fetch('/api/auth/create-department'),
          fetch('/api/auth/create-contract-type'),
        ])

        const [designationsData, prioritiesData, departmentsData, contractTypesData] = await Promise.all([
          designationRes.json(),
          priorityRes.json(),
          departmentRes.json(),
          contractTypeRes.json(),
        ])

        setDesignations(designationsData)
        setPriorities(prioritiesData)
        setDepartments(departmentsData)
        setContractTypes(contractTypesData)
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

const [success, setSuccess] = useState("")
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const payload = {
    jobDescription,
    reasonForRequisition,
    designation,
    priority,
    department,
    contractType,
    dueDate,
    status:"new",
    numberOfPositions,
  }

  try {
    const response = await axios.post('/api/auth/position-requisition', payload)
    if (response.data.success) {
     setSuccess("Requisition submitted successfully✅")
      // optionally reset form
      setJobDescription('')
      setReasonForRequisition('')
      setDesignation('')
      setPriority('')
      setDepartment('')
      setContractType('')
      setDueDate('')
      setNumberOfPositions('')
    } else {
      setError('⚠️ Submission failed.')
    
    }
  } catch (error) {
    console.error('❌ Submission error:', error)
    setError('❌ An error occurred while submitting the requisition.')
  }
}
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="min-h-fit my-1 rounded-md mx-2 bg-[rgb(239,239,239)] flex items-center justify-center p-2">
      <div className="w-[95%] max-w-7xl bg-white rounded-xl shadow-2xl p-4">
        <header className="mb-8 text-center">
          <h3 className="text-xl font-bold text-gray-800">New Position Requisition Form</h3>

        </header>

        {isLoading && <p className="text-center text-blue-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

       <form onSubmit={handleSubmit} className="space-y-4 text-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Designation */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Position Title</label>
      <select
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        required
      >
        <option value="">Select Designation</option>
        {designations.map((d) => (
          <option key={d.titleName} value={d.titleName}>{d.titleName}</option>
        ))}
      </select>
    </div>

    {/* Priority */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Priority Level</label>
      <select
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <option value="">Select Priority</option>
        {priorities.map((p) => (
          <option key={p.priorityCode} value={p.priorityCode}>{p.priorityName}</option>
        ))}
      </select>
    </div>

    {/* Department */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Department</label>
      <select
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.shortName} value={d.shortName}>{d.departmentName}</option>
        ))}
      </select>
    </div>

    {/* Contract Type */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Contract Type</label>
      <select
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={contractType}
        onChange={(e) => setContractType(e.target.value)}
        required
      >
        <option value="">Select Contract Type</option>
        {contractTypes.map((c) => (
          <option key={c.contractCode} value={c.contractCode}>{c.contractName}</option>
        ))}
      </select>
    </div>

    {/* Due Date */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Due Date</label>
      <input
        type="date"
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
    </div>

    {/* Number of Positions */}
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-700">Number of Positions</label>
      <input
        type="number"
        className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-blue-400 text-sm"
        value={numberOfPositions}
        onChange={(e) => setNumberOfPositions(e.target.value)}
        min="1"
        required
      />
    </div>
  </div>

  {/* Job Description */}
  <div>
    <label className="block text-xs font-medium mb-1 text-gray-700">About This Job</label>
    <RichTextEditor value={jobDescription} onChange={setJobDescription} />
   
  </div>

  {/* Reason */}
  <div>
    <label className="block text-xs font-medium mb-1 text-gray-700">Reason for Requisition</label>
    <RichTextEditor value={reasonForRequisition} onChange={setReasonForRequisition} />

  </div>

  {/* Buttons */}
  <div className="flex justify-between mt-6">
    <button
      className="bg-[#E75D5D] text-xs px-4 py-1.5 font-semibold text-white rounded hover:bg-red-700 transition"
      type="button"
      onClick={() => router.back()}
    >
      ❌ Back
    </button>
    <button
      className="bg-blue-600 text-xs px-4 py-1.5 font-semibold text-white rounded hover:bg-blue-700 transition"
      type="submit"
    >
      ✅ Submit Requisition
    </button>
  </div>
</form>

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
    </div>
  )
}

export default NewPositionRequisitionForm