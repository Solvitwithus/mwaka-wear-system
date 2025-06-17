"use client"
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
type Branch = {
  branchCode: string;
  name: string;
}

type ItemsToGrade ={
       code: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  itemPrice: number;
  discountWholesale: number;
   taxAmount: number;
priceBeforeTax:number
}
// type Grading ={
//     branch:string;
//     itemtoGrade:string;
//     gradeReference:string;
//     workCenter:string;
//     gradeDate:string;
//     baleName:string;

// } 
//     const random = `G-Order-${Math.floor(10000 + Math.random() * 90000)}`
// const initialState : Grading={
//   branch:"",
//     itemtoGrade:"",
//     gradeReference:random,
//     workCenter:"",
//     gradeDate:"",
//     baleName:"",
// }
const page = () => {
// const [gardingOrder, setgardingOrder] = useState<Grading>(initialState)

// const changeValue = (e:ChangeEvent<HTMLSelectElement || HTMLInputElement>)=>{
//     const {name,value} = e.target
// }

const [requisitioningBranch, setrequisitioningBranch] = useState<Branch[]>([])
const [itemBale, setitemBale] = useState<ItemsToGrade[]>([])

const fetchData =useCallback( async()=>{
    try{
const [branchRes,baleRes] = await Promise.all([
axios.get("/api/auth/addbranch"),
axios.get("/api/auth/purchase-quotation-entry")
])
setrequisitioningBranch(branchRes.data);
setitemBale(baleRes.data);s
    }
     catch (error) {
      console.error("Failed to fetch:", error);
    }

},[])

useEffect(()=>{
    fetchData()
},[fetchData])
  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
  <h4 className="text-base font-semibold ml-2 mt-2 text-[#b13348]">Grading Sheet</h4>
<form className="border-black border-[1px] m-2 rounded-md w-[98%] mx-auto">
    {/* The upper section table */}
    <div className='flex rounded-md p-1 gap-4 border border-black m-1 w-fit mx-auto'>
        {/* left */}
        <div className='flex flex-col'>
            <div className='flex justify-end items-center mb-1'>
                <label className='text-[0.9rem] text-blue-950  font-semibold' htmlFor="">Select Branch:</label>
                <select name="" id="" className='bg-slate-300 px-2 text-xs text-black rounded-md w-40'>
                    <option value="">--Grade for branch--</option>
                    {requisitioningBranch.map((val)=>(
                        <option value={val.name} key={val.branchCode}>{val.name}</option>
                    ))}
                </select>
            </div>
          
             <div className='flex justify-end items-center mb-1'>
                <label className='text-[0.9rem] text-blue-950 font-semibold' htmlFor="">Item to Grade:</label>
                <input type='text' disabled className='bg-slate-300 px-2 text-xs text-black rounded-md w-40'/>
            </div>
             <div className='flex justify-end items-center'>
                <label className='text-[0.9rem] text-blue-950 font-semibold' htmlFor="">Grade Reference:</label>
                <input type='text' disabled className='bg-slate-300 px-2 text-xs text-black rounded-md w-40' />
            </div>
        </div>
        {/* right */}
        <div className='flex flex-col'>
              <div className='flex justify-end items-center mb-1'>
                <label className='text-[0.9rem] text-blue-950 font-semibold' htmlFor="">Work Center:</label>
                     <select name="" id="" className='bg-slate-300 px-2 text-xs text-black rounded-md w-40'>
                    <option value="">--Grade for branch--</option>
                    {requisitioningBranch.map((val)=>(
                        <option value={val.name} key={val.branchCode}>{val.name}</option>
                    ))}
                </select>
            </div>
               <div className='flex justify-end items-center mb-1'>
                <label className='text-[0.9rem] text-blue-950 font-semibold' htmlFor="">Date:</label>
                <input type='date'  className='bg-slate-300 px-2 text-xs text-black rounded-md w-40'/>
            </div>
              <div className='flex justify-end items-center'>
                <label className='text-[0.9rem] text-blue-950 font-semibold' htmlFor="">Bale:</label>
                <select name="" id="" className='bg-slate-300 px-2 text-xs text-black rounded-md w-40'>
                    <option value="">--Select Bale--</option>
                </select>
            </div>
        </div>
    </div>
{/* Middle Section */}
<div className='flex gap-3 justify-center'>
      <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>Grader:</label>
                <select name="" id="" className='w-40 rounded-md text-xs md bg-slate-300 h-5 pl-2'>
                    <option value="">--pick grader--</option>
                </select>
            </div>
               <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>bale Weight:</label>
                <input type='number' className='w-20 rounded-md bg-slate-300 h-5 pl-2' min={0} />
            </div> 

              <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>Item Count:</label>
                <input type='number' className='w-20 rounded-md bg-slate-300 h-5 pl-2' min={0} />
            </div> 
              <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>Damage Count:</label>
                <input type='number' className='w-20 rounded-md bg-slate-300 h-5 pl-2' min={0} />
            </div> 
          
              
               <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>Damage Weight:</label>
                <input type='number' className='w-20 rounded-md bg-slate-300 h-5 pl-2' min={0} />
            </div> 
               <div className='flex justify-end items-center gap-2'>
                <label htmlFor="" className='text-[0.9rem] text-blue-950'>Unpaired Count:</label>
                <input type='number' className='w-20 rounded-md bg-slate-300 h-5 pl-2' min={0} />
            </div> 
            
</div>

{/* lower section */}
  <h4 className="text-base text-center font-semibold ml-2 mt-2 text-[#b13348]">Items Produced</h4>
  <table className='w-[96%] mx-auto'>
    <thead className='text-sm bg-[#1393AB]'>
        <tr>
            <td  className='border-separate'>Item Code</td>
            <td>Item Name</td>
            <td>Grade</td>
            <td>Quantity</td>
            <td>Selling Price</td>
            <td>Qty to Hold</td>
        </tr>
    </thead>
    <tbody>

    </tbody>
    <div>
        <span>Add Item</span>
    </div>
  </table>
        </form>
    </div>
  )
}

export default page