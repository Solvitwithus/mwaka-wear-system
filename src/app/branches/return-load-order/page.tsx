"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { comment } from "postcss";
interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  grade: string;
  quantity: number;
  sellingPrice: number;
  qtyToHold: number;
}

interface Grading {
  id: string;
  branch: string;
  itemtoGrade: string;
  gradeReference: string;
  workCenter: string;
  gradeDate: string;
  baleName: string;
  grader: string;
  baleWeight: number;
  itemCount: number;
  damageCount: number;
  damageWeight: number;
  unpairedCount: number;
  itemsProduced: Item[];
  status:string;
}

const Page = () => {
   const router = useRouter();
  const [gradeOrder, setGradeOrder] = useState<Grading | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("printBarcodes");

    if (data) {
      try {
        const parsed: Grading = JSON.parse(data);
        setGradeOrder(parsed);
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
      }
    }
  }, []);

  const handleDispatch =async(gradeOrder : any)=>{
await axios.patch("/api/auth/grading-sheet", {
  id: gradeOrder.id,
  status: "returned",
  comment
}

);
router.back()
  }
  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      {/* Main Grade Info Table */}
        <h2 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">
         Confirm Return for Order: <span className="font-bold text-[#b1337c]"> {gradeOrder?.gradeReference}</span>
        </h2>
      <div className="bg-white rounded-md shadow overflow-auto mb-4">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-[#1393AB] text-white">
            <tr>
              <th className="px-4 py-2 border">Branch Name</th>
              <th className="px-4 py-2 border">Grade Reference</th>
              <th className="px-4 py-2 border">Work Center</th>
              <th className="px-4 py-2 border">Grade Date</th>
              <th className="px-4 py-2 border">Bale Name</th>
              <th className="px-4 py-2 border">Item Count</th>
              <th className="px-4 py-2 border">Grader</th>
              <th className="px-4 py-2 border">Bale Weight</th>
            </tr>
          </thead>
          <tbody>
            {gradeOrder ? (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{gradeOrder.branch}</td>
                <td className="px-4 py-2 border">{gradeOrder.gradeReference}</td>
                <td className="px-4 py-2 border">{gradeOrder.workCenter}</td>
                <td className="px-4 py-2 border">{gradeOrder.gradeDate}</td>
                <td className="px-4 py-2 border">{gradeOrder.baleName}</td>
                <td className="px-4 py-2 border">{gradeOrder.itemCount}</td>
                <td className="px-4 py-2 border">{gradeOrder.grader}</td>
                <td className="px-4 py-2 border">{gradeOrder.baleWeight}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No grading orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Produced Items Table */}
      <div className="flex justify-center flex-col">
        <h2 className="text-base text-center font-semibold ml-2 mt-2 text-[#f33555]">
          Produced Items
        </h2>
        <div>
          <table className="w-[40%] mx-auto table-auto border-collapse text-sm rounded-md shadow overflow-auto">
            <thead className="bg-[#1393AB] text-white">
              <tr>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Grade</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Selling Price</th>
                <th className="px-4 py-2 border">Quantity Held</th>
                <th className="px-4 py-2 border">Quantity to Release</th>
              
              </tr>
            </thead>
            <tbody>
              {gradeOrder && gradeOrder.itemsProduced.length > 0 ? (
                gradeOrder.itemsProduced.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.itemName}</td>
                    <td className="px-4 py-2 border">{item.itemCode}</td>
                    <td className="px-4 py-2 border">{item.grade}</td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">{item.sellingPrice}</td>
                    <td className="px-4 py-2 border">{item.qtyToHold}</td>
                    <td className="px-4 py-2 border">
                      {item.quantity - item.qtyToHold}
                    </td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No graded components found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
      <div className="flex flex-col justify-center">
      <label htmlFor="" className="text-[0.9rem] text-blue-950 font-semibold">Comment:</label>
      <textarea className="w-full bg-slate-300 text-xs rounded-md p-2"
            rows={4}></textarea>
      </div>
<div className="flex gap-2 justify-center items-center my-2">
        <button
        className="bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md"
        type="button"
        onClick={() => router.back()}
      >
        Back
      </button>
      
        <button
          type="button"
          className="bg-[#4E803F] text-sm font-semibold px-3 py-[1px] text-white rounded-md"
          onClick={()=>handleDispatch(gradeOrder)}
        >
          Dispatch Return
        </button>
</div>
    </div>
  );
};

export default Page;
