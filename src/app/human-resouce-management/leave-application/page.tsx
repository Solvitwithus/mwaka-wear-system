// "use client";

// import axios from "axios";
// import React, { useEffect, useState } from "react";

// type User = {
//   id: string;
//   userName: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   shortName: string;
//   address: string;
//   email: string;
//   roleId: string;
//   branch: string;
//   phone1: string;
//   phone2: string;
//   description?: string;
// };
// type LeaveName = {
//   leaveCode: string;
//   leaveName: string;
// }
// const Page = () => {
//   const [userData, setUserData] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
// const [leaveType, setleaveType] = useState<LeaveName[]>([])
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [resUser,resLeaveType] = await Promise.all([axios.get("/api/auth/user"),axios.get("/api/auth/create-leave-type")]);
//         setUserData(resUser.data);
//         setleaveType(resLeaveType.data)
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const userId = event.target.value;
//     const user = userData.find((u) => u.id === userId);
//     setSelectedUser(user || null);
//   };

//   return (
//     <div className="bg-[#EFEFEF] m-1 rounded-md  p-4 h-fit">
//       <div className="border-b-[1px] mb-1 pb-1 flex justify-end items-center gap-2 border-[#353434]">
//         <label htmlFor="emp" className="text-sm font-mono font-medium text-[#0b1213]">Select Employee</label>
//       <select name="emp" onChange={handleClientChange} className="bg-[#EFEFEF] pl-2 rounded-sm text-[#112527] border text-xs font-mono h-6 w-36">
//         <option value="">Select Employee</option>
//         {userData.map((val) => (
//           <option key={val.id} value={val.id}>
//             {val.firstName} {val.lastName}
//           </option>
//         ))}
//       </select>
// </div>
//       {/* Employee details */}
//       {selectedUser && (
//         <>
        
//         <div className="flex gap-3 p-1 rounded-md border border-[#727171] w-fit mx-auto">
//           {/* Left */}
//           <div className="border-r-[1px] border-[#727171] pr-3">
//             <span className="text-sm font-semibold text-[#5f5e5e] bg-[#9FBFC5] px-4 block mb-2">
//               Employee Personal Details
//             </span>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//               <label htmlFor="fName" className="text-xs font-mono font-bold text-[#0b1213]">
//                 First Name:
//               </label>
//               <input
//                 id="fName"
//                 readOnly
//                 value={selectedUser.firstName}
//                 className="bg-[#EFEFEF] pointer-events-none pl-2 rounded-sm text-[#146f7a] border text-xs font-mono h-6 w-36"
//               />
//             </div>
//                <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Last Name:</label>
//               <input
//                 readOnly
//                 value={selectedUser.lastName}
//                 className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//               />
//             </div>
//                <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Email:</label>
//               <input
//                 readOnly
//                 value={selectedUser.email}
//                 className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//               />
//             </div>
//                <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Address:</label>
//               <input
//                 readOnly
//                 value={selectedUser.address}
//                 className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//               />
//             </div>
//                 <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Branch:</label>
//               <input
//                 readOnly
//                 value={selectedUser.branch}
//                 className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//               />
//             </div>
//                 <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Phone:</label>
//               <input
//                 readOnly
//                 value={selectedUser.phone1}
//                 className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//               />
//             </div>
//           </div>

//           {/* Right */}
//           <div>
//              <span className="text-sm font-semibold text-[#5f5e5e] bg-[#9FBFC5] px-4 block mb-2">
//               Leave Application
//             </span>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//               <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Type:</label>
//               <select  className="bg-[#EFEFEF] pl-2 rounded-sm text-[#146f7a] border text-xs font-mono h-6 w-36">
// <option value="">Leave Type</option>
// {leaveType.map((val)=>(
//   <option value={val.leaveName} key={val.leaveCode}>{val.leaveName} {val.leaveCode}</option>
// ))}
//               </select>
              
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Current Leave Days Balance:</label>
//              <input type="text" 
//              value={20}
//              className="pl-2 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//              />
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Application Date:</label>
//              <input type="date" 
            
//              className="pl-2 rounded-sm  text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//              />
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Start Date:</label>
//                 <input type="date" 
            
//              className="pl-2 rounded-sm  text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//              />
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Leave End Date:</label>
//                 <input type="date" 
            
//              className="pl-2 rounded-sm  text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//              />
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Days Applied:</label>
//                 <input type="number" 
            
//              className="pl-2 rounded-sm  text-[#146f7a] text-xs font-mono h-6 w-36 bg-[#EFEFEF] border"
//              />
//             </div>
//             <div className="flex gap-2 items-center mb-2 justify-end">
//              <label className="text-xs font-mono font-bold text-[#0b1213]">Remarks:</label>
//              <textarea
//              cols={10} rows={3}
//              />
//             </div>
//           </div>
         
//         </div>
//       <br/>
//       <hr/>
//           <button className="bg-[#4E803F] mb-2 text-sm font-semibold px-3 ml-[50%] py-[1px] text-white rounded-md">Apply Leave</button>
//           <br/>
//       <hr/>
//        </>
//       )}
//     </div>
//   );
// };

// export default Page;


"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

type User = {
  id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  shortName: string;
  address: string;
  email: string;
  roleId: string;
  branch: string;
  phone1: string;
  phone2: string;
  description?: string;
};

type LeaveName = {
  leaveCode: string;
  leaveName: string;
};

type LeaveApplication = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  branch: string;
  phone: string;
  leaveType: string;
  leaveBalance: number;
  applicationDate: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  remarks: string;
};

const Page = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [leaveType, setLeaveType] = useState<LeaveName[]>([]);
const [error, setError] = useState("")
const [success, setSuccess] = useState("")
  // Leave form states
  const [selectedLeave, setSelectedLeave] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveDays, setLeaveDays] = useState(0);
  const [remarks, setRemarks] = useState("");
  const leaveBalance = 20; // static for now

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUser, resLeaveType] = await Promise.all([
          axios.get("/api/auth/user"),
          axios.get("/api/auth/create-leave-type"),
        ]);
        setUserData(resUser.data);
        setLeaveType(resLeaveType.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const user = userData.find((u) => u.id === userId);
    setSelectedUser(user || null);
  };

  const calculateLeaveDays = (start: string, end: string) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return days > 0 ? days : 0;
  };

  useEffect(() => {
    if (startDate && endDate) {
      setLeaveDays(calculateLeaveDays(startDate, endDate));
    }
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    if (!selectedUser) return setError("Please select an employee");

    const payload: LeaveApplication = {
      employeeId: selectedUser.id,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      address: selectedUser.address,
      branch: selectedUser.branch,
      phone: selectedUser.phone1,
      leaveType: selectedLeave,
      leaveBalance,
      applicationDate,
      startDate,
      endDate,
      leaveDays,
      remarks,
    };

    try {
      await axios.post("/api/auth/leave-appliation", payload);
      setSuccess("Leave application submitted!");
    } catch (error) {
      console.error("Failed to submit leave application", error);
      setError("Submission failed.");
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);
  return (
    <div className="bg-[#EFEFEF] m-1 rounded-md p-4 h-fit">
      <div className="border-b mb-2 pb-2 flex justify-end items-center gap-2 border-gray-700">
        <label htmlFor="emp" className="text-sm font-mono font-medium text-[#0b1213]">
          Select Employee
        </label>
        <select
          name="emp"
          onChange={handleClientChange}
          className="bg-white pl-2 rounded-sm text-[#112527] border text-xs font-mono h-6 w-36"
        >
          <option value="">Select Employee</option>
          {userData.map((val) => (
            <option key={val.id} value={val.id}>
              {val.firstName} {val.lastName}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          <div className="flex gap-3 p-2 rounded-md border border-gray-500 w-fit mx-auto">
            {/* Left - Employee Details */}
            <div className="border-r pr-3">
              <span className="text-sm font-semibold text-gray-600 bg-[#9FBFC5] px-4 block mb-2">
                Employee Personal Details
              </span>
              {[
                ["First Name", selectedUser.firstName],
                ["Last Name", selectedUser.lastName],
                ["Email", selectedUser.email],
                ["Address", selectedUser.address],
                ["Branch", selectedUser.branch],
                ["Phone", selectedUser.phone1],
              ].map(([label, value], i) => (
                <div className="flex gap-2 items-center mb-2 justify-end" key={i}>
                  <label className="text-xs font-mono font-bold text-[#0b1213]">{label}:</label>
                  <input
                    readOnly
                    value={value}
                    className="pl-2 w-36 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                  />
                </div>
              ))}
            </div>

            {/* Right - Leave Application */}
            <div>
              <span className="text-sm font-semibold text-gray-600 bg-[#9FBFC5] px-4 block mb-2">
                Leave Application
              </span>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Type:</label>
                <select
                  value={selectedLeave}
                  onChange={(e) => setSelectedLeave(e.target.value)}
                  className="bg-[#EFEFEF] pl-2 rounded-sm text-[#146f7a] border text-xs font-mono h-6 w-36"
                >
                  <option value="">Leave Type</option>
                  {leaveType.map((val) => (
                    <option value={val.leaveName} key={val.leaveCode}>
                      {val.leaveName} {val.leaveCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Days Balance:</label>
                <input
                  type="text"
                  value={leaveBalance}
                  readOnly
                  className="pl-2 w-36 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                />
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Application Date:</label>
                <input
                  type="date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="pl-2 w-36 rounded-sm text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                />
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-2 w-36 rounded-sm text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                />
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Leave End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-2 w-36 rounded-sm text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                />
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Leave Days Applied:</label>
                <input
                  type="number"
                  value={leaveDays}
                  readOnly
                  className="pl-2 w-36 rounded-sm pointer-events-none text-[#146f7a] text-xs font-mono h-6 bg-[#EFEFEF] border"
                />
              </div>

              <div className="flex gap-2 items-center mb-2 justify-end">
                <label className="text-xs font-mono font-bold text-[#0b1213]">Remarks:</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="pl-2 text-[#146f7a] text-xs font-mono bg-[#EFEFEF] border rounded-sm"
                  rows={3}
                  cols={25}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-[#4E803F] text-sm font-semibold px-4 py-1 text-white rounded-md hover:bg-green-700"
            >
              Apply Leave
            </button>
          </div>
        </>
      )}
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
