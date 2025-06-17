"use client";
import axios from 'axios';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
type Branch = {
  branchCode: string;
  name: string;
};

type PurchaseEntryItem = {
  itemName: string;
  quantity: number;
};

type DeliveryDetail = {
  deliverTo?: string;
  reqDate: string;
  dueDate?: string;
  code?: string;
};

type Supplier = {
  name?: string;
  bankName?: string;
  id: string;
  reqId: string;
  contactPhone: string;
  contactEmail: string;
  shipping: number;
  subtotal: number;
  grandTotal: number;
  status: string;
  remarks: string;
};

type PurchaseReqEntry = {
  id: string;
  supplier: Supplier;
  purchaseAdditionalInfo?: DeliveryDetail;
  items: PurchaseEntryItem[];
  bankName?: string;
  reqDate: string;
  dueDate?: string;
  grandTotal: number;
  shipping: number;
  status: string;
};

type Grade = {
  gradeName: string;
};

type Grading = {
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
  itemsProduced: {
    itemCode: string;
    itemName: string;
    grade: string;
    quantity: number;
    sellingPrice: number;
    qtyToHold: number;
  }[];
  comment: string;
};
type Role ={
     id  :string;      
  name:string; 
}
type User = {
  userName: string;
  firstName: string;
  lastName: string;
  role?: Role;
};

const generateRandomReference = () => `G-Order-${Math.floor(10000 + Math.random() * 90000)}`;

const initialState: Grading = {
  branch: "",
  itemtoGrade: "",
  gradeReference: generateRandomReference(),
  workCenter: "",
  gradeDate: "",
  baleName: "",
  grader: "",
  baleWeight: 0,
  itemCount: 0,
  damageCount: 0,
  damageWeight: 0,
  unpairedCount: 0,
  itemsProduced: [],
  comment: "",
};

const Page = () => {
    const router = useRouter();
  const [gradingOrder, setGradingOrder] = useState<Grading>(initialState);
  const [gradersEmployees, setGradersEmployees] = useState<User[]>([]);
  const [filterUsers, setFilterUsers] = useState<User[]>([]);
  const [requisitioningBranch, setRequisitioningBranch] = useState<Branch[]>([]);
  const [itemBale, setItemBale] = useState<PurchaseReqEntry[]>([]);
  const [filterBale, setFilterBale] = useState<PurchaseReqEntry[]>([]);
  const [grade, setGrade] = useState<Grade[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [branchRes, baleRes, gradeRes, userRes] = await Promise.all([
        axios.get("/api/auth/addbranch"),
        axios.get("/api/auth/purchase-quotation-entry"),
        axios.get("/api/auth/grade-creation"),
        axios.get("/api/auth/managers"),
      ]);
      setRequisitioningBranch(branchRes.data || []);
      setItemBale(Array.isArray(baleRes.data.data) ? baleRes.data.data : []);
      setGrade(gradeRes.data || []);
      setGradersEmployees(userRes.data || []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    const filter = Array.isArray(itemBale)
      ? itemBale.filter((berooo) => berooo.status === "ready-to-thrift")
      : [];
    setFilterBale(filter);

    const correctRole = gradersEmployees.filter((role) => role.role?.name === "grader");
    setFilterUsers(correctRole);
  }, [itemBale, gradersEmployees]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGradingOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setGradingOrder((prev) => {
      const newItems = [...prev.itemsProduced];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, itemsProduced: newItems };
    });
  };

  

  const addItemRow = () => {
    setGradingOrder((prev) => ({
      ...prev,
      itemsProduced: [
        ...prev.itemsProduced,
        {
          itemCode: `${gradingOrder.itemtoGrade.slice(0, 3).toUpperCase()}${Math.floor(
            10000000 + Math.random() * 90000000
          )}`,
          itemName: "",
          grade: "",
          quantity: 0,
          sellingPrice: 0,
          qtyToHold: 0,
        },
      ],
    }));
  };

  const deleteItemRow = (index: number) => {
    setGradingOrder((prev) => ({
      ...prev,
      itemsProduced: prev.itemsProduced.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     console.log(gradingOrder);
    const selectedBale = filterBale.find((bale) => bale.items.some((item) => item.itemName === gradingOrder.baleName));
    if (selectedBale) {
      try {
        await axios.patch("/api/auth/purchase-quotation-entry", {
          id: selectedBale.id,
          status: "graded",
        });
        alert("Grading processed successfully!");
        setGradingOrder(initialState); // Reset form
      } catch (error) {
        console.error("Failed to process grading:", error);
        alert("Failed to process grading.");
      }
    }
   
      router.refresh()
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Grading Sheet</h4>
      <form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto" onSubmit={handleSubmit}>
        <div className="flex rounded-md p-1 gap-4 m-1 w-fit mx-auto">
          <div className="flex flex-col">
            <div className="flex justify-end items-center mb-1">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="branch">
                Select Branch:
              </label>
              <select
                name="branch"
                value={gradingOrder.branch}
                onChange={handleChange}
                className="bg-slate-300 px-2 text-xs text-black rounded-md w-40 h-6 ml-2"
              >
                <option value="">--Grade for--</option>
                {requisitioningBranch.map((val) => (
                  <option value={val.name} key={val.branchCode}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-center mb-1">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="itemtoGrade">
                Item to Grade:
              </label>
              <input
                name="itemtoGrade"
                value={gradingOrder.baleName ? gradingOrder.baleName.replace(" bale", "") : ""}
                disabled
                className="bg-slate-200 px-2 text-xs text-blue-950 font-semibold rounded-md w-40 h-6 ml-2"
              />
            </div>
            <div className="flex justify-end items-center">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="gradeReference">
                Grade Reference:
              </label>
              <input
                name="gradeReference"
                value={gradingOrder.gradeReference}
                disabled
                className="bg-slate-200 px-2 text-xs text-blue-950 font-semibold rounded-md w-40 h-6 ml-2"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-end items-center mb-2">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="workCenter">
                Work Center:
              </label>
              <select
                name="workCenter"
                value={gradingOrder.workCenter}
                onChange={handleChange}
                className="bg-slate-300 px-2 text-xs text-black rounded-md w-40 h-6 ml-2"
              >
                <option value="">--Select Work Center--</option>
                {requisitioningBranch.map((val) => (
                  <option value={val.name} key={val.branchCode}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-center mb-2">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="gradeDate">
                Date:
              </label>
              <input
                type="date"
                name="gradeDate"
                value={gradingOrder.gradeDate}
                onChange={handleChange}
                className="bg-slate-300 px-2 text-xs text-black rounded-md w-40 h-6 ml-2"
              />
            </div>
            <div className="flex justify-end items-center">
              <label className="text-[0.9rem] text-blue-950 font-semibold" htmlFor="baleName">
                Bale:
              </label>
              <select
                name="baleName"
                value={gradingOrder.baleName}
                onChange={handleChange}
                className="bg-slate-300 px-2 text-xs text-black rounded-md w-40 h-6 ml-2"
              >
                <option value="">--Select Bale--</option>
                {filterBale.map((val) =>
                  val.items.map((item, idx) => (
                    <option value={item.itemName} key={`${val.id}-${idx}`}>
                      {item.itemName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="grader" className="text-[0.9rem] text-blue-950">
              Grader:
            </label>
            <select
              name="grader"
              value={gradingOrder.grader}
              onChange={handleChange}
              className="w-40 rounded-md text-xs bg-slate-300 h-6 pl-2"
            >
              <option value="">--Pick Grader--</option>
              {filterUsers.map((val) => (
                <option value={val.userName} key={val.userName}>
                  {val.firstName} {val.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="baleWeight" className="text-[0.9rem] text-blue-950">
              Bale Weight:
            </label>
            <input
              type="number"
              name="baleWeight"
              value={gradingOrder.baleWeight}
              onChange={handleChange}
              className="w-20 rounded-md bg-slate-300 h-6 pl-2"
              
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="itemCount" className="text-[0.9rem] text-blue-950">
              Item Count:
            </label>
            <input
              type="number"
              name="itemCount"
              value={gradingOrder.itemCount}
              onChange={handleChange}
              className="w-20 rounded-md bg-slate-300 h-6 pl-2"
              min={0}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="damageCount" className="text-[0.9rem] text-blue-950">
              Damage Count:
            </label>
            <input
              type="number"
              name="damageCount"
              value={gradingOrder.damageCount}
              onChange={handleChange}
              className="w-20 rounded-md bg-slate-300 h-6 pl-2"
              min={0}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="damageWeight" className="text-[0.9rem] text-blue-950">
              Damage Weight:
            </label>
            <input
              type="number"
              name="damageWeight"
              value={gradingOrder.damageWeight}
              onChange={handleChange}
              className="w-20 rounded-md bg-slate-300 h-6 pl-2"
              min={0}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <label htmlFor="unpairedCount" className="text-[0.9rem] text-blue-950">
              Unpaired Count:
            </label>
            <input
              type="number"
              name="unpairedCount"
              value={gradingOrder.unpairedCount}
              onChange={handleChange}
              className="w-20 rounded-md bg-slate-300 h-6 pl-2"
              min={0}
            />
          </div>
        </div>

        <h4 className="text-base text-center font-semibold ml-2 mt-2 text-[#b13348]">
          Items Produced
        </h4>
        <table className="w-[96%] mx-auto border-collapse">
          <thead className="text-sm bg-[#1393AB]">
            <tr>
              <th className="border border-gray-400 p-2">Item Code</th>
              <th className="border border-gray-400 p-2">Item Name</th>
              <th className="border border-gray-400 p-2">Grade</th>
              <th className="border border-gray-400 p-2">Quantity</th>
              <th className="border border-gray-400 p-2">Selling Price</th>
              <th className="border border-gray-400 p-2">Qty to Hold</th>
              <th className="border border-gray-400 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {gradingOrder.itemsProduced.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={item.itemCode}
                    disabled
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <select
                    value={item.grade}
                    onChange={(e) => handleItemChange(index, "grade", e.target.value)}
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                  >
                    <option value="">--Grade--</option>
                    {grade.map((val, idx) => (
                      <option value={val.gradeName} key={idx}>
                        {val.gradeName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                    min={0}
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="number"
                    value={item.sellingPrice}
                    onChange={(e) => handleItemChange(index, "sellingPrice", Number(e.target.value))}
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                    min={0}
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="number"
                    value={item.qtyToHold}
                    onChange={(e) => handleItemChange(index, "qtyToHold", Number(e.target.value))}
                    className="w-full bg-slate-300 text-xs rounded-md p-1"
                    min={0}
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <button type="button" onClick={() => deleteItemRow(index)}>
                    <Trash2 className="text-red-600" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end m-2">
          <button
            type="button"
            onClick={addItemRow}
            className="bg-[#1393AB] text-white text-xs rounded-md px-4 py-1 hover:bg-[#0f7a8c]"
          >
            Add Item
          </button>
        </div>
        <div className="m-2 flex flex-col">
          <label htmlFor="comment" className="text-[0.9rem] text-blue-950 font-semibold">
            Comment
          </label>
          <textarea
            name="comment"
            value={gradingOrder.comment}
            onChange={handleChange}
            className="w-full bg-slate-300 text-xs rounded-md p-2"
            rows={4}
          />
        </div>
        <div className="flex justify-center m-2">
          <button
            type="submit"
            className="bg-[#b13348] text-white text-xs rounded-md px-4 py-1 hover:bg-[#912a3b]" onClick={handleSubmit}
          >
            🐰Process
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;