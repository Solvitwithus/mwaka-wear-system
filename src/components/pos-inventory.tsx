"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

// --- Types ---
type User = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  shortName: string;
  address: string;
  email: string;
  password: string;
  roleId: string;
  branch: string;
  phone1: string;
  phone2: string;
  description: string;
  role?: {
    name: string;
    permissions: { name: string; value: boolean }[];
  };
};

type ItemProduced = {
  itemCode: string;
  itemName: string;
  grade: string;
  quantity: number;
  sellingPrice: number;
  qtyToHold: number;
  qtyToDispatch: number;
};

type Grading = {
  branch: string;
  itemtoGrade: string;
  gradeReference: string;
  workCenter: string;
  gradeDate: string;
  baleName: string;
  grader: string;
  status: string;
  baleWeight: number;
  itemCount: number;
  damageCount: number;
  damageWeight: number;
  unpairedCount: number;
  itemsProduced: ItemProduced[];
  comment: string;
};

const PosInventory = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gradingSheets, setGradingSheets] = useState<Grading[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemProduced[]>([]);

  // 1. Fetch current user using JWT-auth protected API
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/access");
      if (response.data?.user) {
        setUser(response.data.user);
        console.log("Logged-in user:", response.data.user);
      } else {
        console.warn("User object not found in /access response");
      }
    } catch (error) {
      console.error("Failed to fetch current user from /access:", error);
    }
  }, []);

  // 2. Fetch grading sheets
  const getGradingSheets = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/grading-sheet");
      setGradingSheets(response.data);
    } catch (error) {
      console.error("Failed to fetch grading sheets:", error);
    }
  }, []);

  // 3. Filter grading sheets by user's branch and status = "received"
  useEffect(() => {
    if (user?.branch && gradingSheets.length > 0) {
      const matchedItems = gradingSheets
        .filter(
          (sheet) =>
            sheet.branch.toLowerCase() === user.branch.toLowerCase() &&
            sheet.status.toLowerCase() === "received"
        )
        .flatMap((sheet) => sheet.itemsProduced);
      setFilteredItems(matchedItems);
    }
  }, [user, gradingSheets]);

  // 4. Load data
  useEffect(() => {
    getCurrentUser();
    getGradingSheets();
  }, [getCurrentUser, getGradingSheets]);

  return (
    <div className="h-fit">
      <h1 className="text-xl font-semibold text-[#A4F1FF] mb-4">
        Items Available for Branch:{" "}
        <span className="text-green-700">{user?.branch || "Loading..."}</span>
      </h1>

      <div className="rounded shadow overflow-auto">
        <table className="w-[80%] cursor-text bg-[#746E6E] text-sm border-collapse">
          <thead className="bg-[#1393AB] ml-10 text-white">
            <tr>
              <th className="px-4 py-2 border">Item Code</th>
              <th className="px-4 py-2 border">Item Name</th>
              <th className="px-4 py-2 border">Grade</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Selling Price</th>
           
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 hover:text-amber-950">
                  <td className="px-4 py-2 border">{item.itemCode}</td>
                  <td className="px-4 py-2 border">{item.itemName}</td>
                  <td className="px-4 py-2 border">{item.grade}</td>
                   <td className="px-4 py-2 border">{item.qtyToDispatch}</td>
                  <td className="px-4 py-2 border">{item.sellingPrice}</td>
                
               
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No items available for your branch with status "received".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PosInventory;
