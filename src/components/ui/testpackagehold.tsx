// // "use client"
// import axios from 'axios'
// import React, { useCallback, useEffect, useState } from 'react'
// type clientie ={
// customerName:string,
// branchName:string,
// refNo:string,
// creditLimit:string,
// allowedDiscount:string,
// paymentTerms:string,
// preferedPaymentMethod:string,
// salesType:string,
// phone1:string,
// email:string,
// customerId:string,
// kraPin:string,
// }
// type branchie = {
//   branchCode:string,
//           name: string,
// }

// type vehicle ={
//   plateNumber:string,
//   model: string,
// }

// type fahrer = {
//   licenseNumber: string,
//   userName: string,
// }

// type shiftie ={
//   shiftName: string;
//   shiftCode: string;
// }

// type itemie = {
//    code: string;
//   name: string;
//   description: string;
//   unitOfMeasure: string;
//   itemPrice: number;
//   discountWholesale: number;
// taxType: string;


// }

// type taxie = {
//   name: string;
//   code: string;
// fixedAmount: number;
// }

// type jointaxie = itemie & taxie;
// const Page =()=>{
// const [selectedClient, setSelectedClient] = useState<clientie | null>(null);
//   const [clients, setclient] = useState<clientie[]>([])
//   const [drivers, setDrivers] = useState<fahrer[]>([]);
//   const [vehicles, setVehicles] = useState<vehicle[]>([])
//   const [shift, setShift] = useState<shiftie[]>([])
//   const [tax, setTax] = useState<taxie[]>([])
//   const [itemized, setitemized] = useState<itemie[]>([])
//   const [branch, setBranch] = useState<branchie[]>([])

//   // added
//   const [itemsTable, setItemsTable] = useState([
//     {
//       name: "",
//       code: "",
//       description: "",
//       unitOfMeasure: "",
//       itemPrice: 0,
//       discountWholesale: 0,
//       fixedAmount: 0,
//       quantity: 1,
//       tax: 0,
//       total: 0,
//     },
//   ]);
//   const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const customerName = event.target.value;
//         const client = clients.find(client => client.customerName === customerName);
//         setSelectedClient(client || null);
//     };


     









//   const fetchItem = useCallback(async()=>{
//      try {
//       const [itmRes,taxRes,vehicleRes,driverRes,shiftRes,branchres,clientRes] = await Promise.all([
// axios.get("/api/auth/items-creation"),
// axios.get("/api/auth/create-tax"),
// axios.get("/api/auth/addvehicle"),
// axios.get("/api/auth/adddriver"),
// axios.get("/api/auth/addshift"),
// axios.get("/api/auth/addbranch"),
// axios.get("/api/auth/addclient")
//       ])
      
//       setitemized(itmRes.data);
//       setTax(taxRes.data)
//       setVehicles(vehicleRes.data);
//       setDrivers(driverRes.data);
//       setShift(shiftRes.data);
//       setBranch(branchres.data);
// setclient(clientRes.data)
//     } catch (error) {
//       console.error("Failed to fetch:", error);
//     }
//   },[])



//   useEffect(()=>{fetchItem()},[fetchItem])


//   const [jointTaxItem, setjointTaxItem] = useState<jointaxie[]>([])
//   const merged = itemized.map((item, index) => ({
//   ...item,
//   ...(tax[index] || {}) // merge tax if it exists, otherwise skip
// }));

// setjointTaxItem(merged);

// // added

//   const handleItemChange = (index, key, value) => {
//     const updated = [...itemsTable];
//     if (key === "name") {
//       const found = jointTaxItem.find((item) => item.name === value);
//       if (found) {
//         updated[index] = {
//           ...updated[index],
//           name: found.name,
//           code: found.code,
//           description: found.description,
//           unitOfMeasure: found.unitOfMeasure,
//           itemPrice: found.itemPrice,
//           discountWholesale: found.discountWholesale,
//           fixedAmount: found.fixedAmount,
//           quantity: 1,
//           tax: found.fixedAmount - found.itemPrice,
//           total:
//             (found.itemPrice - found.discountWholesale + (found.fixedAmount - found.itemPrice)) * 1,
//         };
//       }
//     } else if (key === "quantity") {
//       const qty = parseInt(value) || 0;
//       updated[index].quantity = qty;
//       updated[index].total =
//         (updated[index].itemPrice - updated[index].discountWholesale + updated[index].tax) * qty;
//     }
//     setItemsTable(updated);
//   };

//   const addNewItemRow = () => {
//     setItemsTable([
//       ...itemsTable,
//       {
//         name: "",
//         code: "",
//         description: "",
//         unitOfMeasure: "",
//         itemPrice: 0,
//         discountWholesale: 0,
//         fixedAmount: 0,
//         quantity: 1,
//         tax: 0,
//         total: 0,
//       },
//     ]);
//   };
//     return(
//         // container
//         <div className='bg-[#EFEFEF] m-1 rounded-md p-1 h-fit'>
//             <h4 className='text-black font-medium ml-1 text-sm '>New Sales Quotation Entry</h4>
//             {/* upper section */}
//             <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
// <h6 className='text-center text-sm text-black font-semibold'>Customer Information</h6>
// {/* innerbody container */}
// <div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-10 pt-1'>
//     {/* left section */}
// <div className='flex flex-col ml-4'>
// <div className='flex gap-1 justify-center'>
//     <label className='text-sm text-black'>Customer:</label>
//     <select onChange={handleClientChange} className='my-[1px] bg-[#f5c5c5]'>
//         <option value="">Select Customer</option>
//            {clients.map((value)=>(
//             <option key={value.refNo} value={value.customerName}>{value.customerName}</option>
//            ))}
//     </select>
// </div>

// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Branch Name:</label>
//     <input type='text' value={selectedClient?.branchName || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
// </div>

// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Ref No:</label>
//     <input type='text' value={selectedClient?.refNo || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
// </div>
// </div>
// {/* middle section */}
// <div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Credit Limit:</label>
//     <input type='text' readOnly value={selectedClient?.creditLimit || ''} className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Discount Allowed:</label>
//     <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.allowedDiscount || ''}/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Phone:</label>
//     <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.phone1 || ''}/>
// </div>
// </div>
// {/* added */}
// <div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>ID No:</label>
//     <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.customerId || ''}/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>email:</label>
//     <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.email || ''}/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>KRA Pin:</label>
//     <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.kraPin || ''}/>
// </div>
// </div>
// {/* right section */}
// <div >
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Payment Terms:</label>
//     <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.paymentTerms || ''}/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Sales Types:</label>
//     <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.salesType || ''}/>
// </div>
// <div className='flex gap-1 justify-end'>
//     <label className='text-sm text-black'>Payment Method:</label>
//     <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.preferedPaymentMethod || ''}/>
// </div>
// </div>
// </div>
//             </div>
//             {/* Table Section */}
//            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
//   <h6 className='px-2 py-1 font-semibold text-sm text-black'>Quotation Items</h6>

//   <table className='border-[1px] border-black mb-2 mx-1 rounded-md w-[99%] table-auto'>
//     <thead className='bg-gray-100'>
//       <tr className='text-sm bg-[#099EBA] text-white'>
//         <th className='border px-2 py-1'>Item Code</th>
//         <th className='border px-2 py-1'>Item Name</th>
//         <th className='border px-2 py-1'>Item Description</th>
//         <th className='border px-2 py-1'>Quantity</th>
//         <th className='border px-2 py-1'>Unit</th>
//         <th className='border px-2 py-1'>Price before tax</th>
//         <th className='border px-2 py-1'>Discount</th>
//         <th className='border px-2 py-1'>Tax</th>
//         <th className='border px-2 py-1'>Total</th>
//         <th className='border px-2 py-1'>Action</th>
//       </tr>
//     </thead>

//     <tbody>


//              {itemsTable.map((item, idx) => (
//             <tr key={idx}>
//               <td>
//                 <input readOnly value={item.code} className="bg-gray-200" />
//               </td>
//               <td>
//                 <select
//                   value={item.name}
//                   onChange={(e) => handleItemChange(idx, "name", e.target.value)}
//                 >
//                   <option value="">Select</option>
//                   {jointTaxItem.map((itm) => (
//                     <option key={itm.name} value={itm.name}>
//                       {itm.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//               <td>
//                 <input readOnly value={item.description} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
//                 />
//               </td>
//               <td>
//                 <input readOnly value={item.unitOfMeasure} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.itemPrice} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.discountWholesale} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.tax.toFixed(2)} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.total.toFixed(2)} className="bg-gray-200" />
//               </td>
//             </tr>
//           ))}
//       {/* <tr>
//     <td className='border px-2 py-1'>
//       <input type='text' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <select className='w-full px-1 py-0.5 border bg-[#f5c5c5] h-6 rounded-sm'>
//         <option value="">Select Item</option>
//         {jointTaxItem.map((val)=>(
//           <option key={val.name} value={val.name}>{val.name}</option>
//         ))}
//       </select>
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='text' className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='number' className='w-20   bg-[#f5c5c5] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='text' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='number' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='number' className='w-20  bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//       <input type='number' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
//     </td>

//     <td className='border px-2 py-1'>
//     <input type='number' className='w-20  bg-[#D1CBCB] rounded-sm h-5' />
//     </td>
//     <td>
//         🚮
//     </td>
//       </tr> */}

//       <tr className='border'>
//         <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Shipping Amount: 0.00</td>
//       </tr>
//       <tr className='border'>
//         <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Sub-Total: 0.00</td>
//       </tr>
//       <tr className='border'>
//         <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Final Amount: 0.00</td>
//       </tr>
//     </tbody>
//   </table>

// <button
//         className="mt-2 text-blue-600 underline"
//         onClick={addNewItemRow}
//       >
//         + Add Item
//       </button>
// </div>



//                       {/* lower section */}
//             <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
// <h6 className='text-center text-sm text-black font-semibold'>Quotation Delivery Details</h6>
// {/* innerbody container */}
// <div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-32 justify-center '>
//     {/* left section */}
// <div className='py-1'>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Delivery From:</label>
//     <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
//         <option value="">Select Branch</option>
//            {branch.map((value)=>(
//             <option key={value.branchCode} value={value.name}>{value.name}</option>
//            ))}
//     </select>
// </div> 

// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Due Date:</label>
//     <input type='date' className='bg-[#D9D9D9] h-6 rounded-md'/>
// </div>

// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Vehicle:</label>
//    <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
//         <option value="">Select Vehicle</option>
//                  {vehicles.map((d) => (
//     <option key={d.plateNumber} value={d.model}>
//       {d.model} ({d.plateNumber})
//     </option>
//   ))}
//     </select>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Driver:</label>
//     <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
//          <option value="">Select Driver</option>
//                {drivers.map((d) => (
//     <option key={d.licenseNumber} value={d.userName}>
//       {d.userName}
//     </option>
//   ))}
//     </select>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Trip:</label>
//     <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
//         <option value="">Select Shift</option>
//           {shift.map((val)=>(<option key={val.shiftCode} value={val.shiftName}>{val.shiftName}</option>))}
//     </select>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Accompanied by:</label>
//     <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Address:</label>
//     <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
// </div>
// </div>
// {/* right section */}
// <div className='pt-1'>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Phone Number::</label>
//     <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Customer reference:</label>
//     <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md' aria-readonly/>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Comment:</label>
    
//     <textarea name="" id="" cols={30} rows={3} className='my-[1px] bg-[#D9D9D9] rounded-md'></textarea>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Destination:</label>
//     <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
// </div>
// <div className='flex justify-end gap-2'>
//     <label className='text-sm text-black'>Offload:</label>
//     <input type='checkbox' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
// </div>
// </div>
// </div>
//             </div>

//             {/* control Buttons */}
//             <div className='flex gap-5 justify-center'>
//                 <button className='bg-[#4E803F] text-sm font-semibold px-3 py-[1px] text-white rounded-md'>Add Quotation</button>
//                 <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md'>Cancel Quotation</button>

//             </div>
//         </div>
//     )
// }
// export default Page;























// // Updated Sales Quotation Entry Form with Dynamic Item Rows
// "use client";
// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";

// // Types
// // ... [keep your existing types: clientie, branchie, vehicle, fahrer, shiftie, itemie, taxie, jointaxie] ...

// const Page = () => {
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [clients, setClients] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [shift, setShift] = useState([]);
//   const [tax, setTax] = useState([]);
//   const [itemized, setItemized] = useState([]);
//   const [branch, setBranch] = useState([]);
//   const [jointTaxItem, setJointTaxItem] = useState([]);
//   const [itemsTable, setItemsTable] = useState([
//     {
//       name: "",
//       code: "",
//       description: "",
//       unitOfMeasure: "",
//       itemPrice: 0,
//       discountWholesale: 0,
//       fixedAmount: 0,
//       quantity: 1,
//       tax: 0,
//       total: 0,
//     },
//   ]);

//   const handleClientChange = (e) => {
//     const selected = clients.find((c) => c.customerName === e.target.value);
//     setSelectedClient(selected || null);
//   };

//   const fetchItem = useCallback(async () => {
//     try {
//       const [itmRes, taxRes, vehicleRes, driverRes, shiftRes, branchRes, clientRes] = await Promise.all([
//         axios.get("/api/auth/items-creation"),
//         axios.get("/api/auth/create-tax"),
//         axios.get("/api/auth/addvehicle"),
//         axios.get("/api/auth/adddriver"),
//         axios.get("/api/auth/addshift"),
//         axios.get("/api/auth/addbranch"),
//         axios.get("/api/auth/addclient"),
//       ]);
//       setItemized(itmRes.data);
//       setTax(taxRes.data);
//       setVehicles(vehicleRes.data);
//       setDrivers(driverRes.data);
//       setShift(shiftRes.data);
//       setBranch(branchRes.data);
//       setClients(clientRes.data);
//       const merged = itmRes.data.map((item, index) => ({
//         ...item,
//         ...(taxRes.data[index] || {}),
//       }));
//       setJointTaxItem(merged);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchItem();
//   }, [fetchItem]);

//   const handleItemChange = (index, key, value) => {
//     const updated = [...itemsTable];
//     if (key === "name") {
//       const found = jointTaxItem.find((item) => item.name === value);
//       if (found) {
//         updated[index] = {
//           ...updated[index],
//           name: found.name,
//           code: found.code,
//           description: found.description,
//           unitOfMeasure: found.unitOfMeasure,
//           itemPrice: found.itemPrice,
//           discountWholesale: found.discountWholesale,
//           fixedAmount: found.fixedAmount,
//           quantity: 1,
//           tax: found.fixedAmount - found.itemPrice,
//           total:
//             (found.itemPrice - found.discountWholesale + (found.fixedAmount - found.itemPrice)) * 1,
//         };
//       }
//     } else if (key === "quantity") {
//       const qty = parseInt(value) || 0;
//       updated[index].quantity = qty;
//       updated[index].total =
//         (updated[index].itemPrice - updated[index].discountWholesale + updated[index].tax) * qty;
//     }
//     setItemsTable(updated);
//   };

//   const addNewItemRow = () => {
//     setItemsTable([
//       ...itemsTable,
//       {
//         name: "",
//         code: "",
//         description: "",
//         unitOfMeasure: "",
//         itemPrice: 0,
//         discountWholesale: 0,
//         fixedAmount: 0,
//         quantity: 1,
//         tax: 0,
//         total: 0,
//       },
//     ]);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="font-bold">Sales Quotation</h2>

//       {/* Client Selector */}
//       <div className="my-2">
//         <label>Customer:</label>
//         <select onChange={handleClientChange} className="ml-2">
//           <option value="">Select</option>
//           {clients.map((c) => (
//             <option key={c.refNo} value={c.customerName}>
//               {c.customerName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Table */}
//       <table className="w-full border mt-4">
//         <thead>
//           <tr className="bg-gray-300">
//             <th>Code</th>
//             <th>Name</th>
//             <th>Description</th>
//             <th>Qty</th>
//             <th>Unit</th>
//             <th>Price</th>
//             <th>Discount</th>
//             <th>Tax</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {itemsTable.map((item, idx) => (
//             <tr key={idx}>
//               <td>
//                 <input readOnly value={item.code} className="bg-gray-200" />
//               </td>
//               <td>
//                 <select
//                   value={item.name}
//                   onChange={(e) => handleItemChange(idx, "name", e.target.value)}
//                 >
//                   <option value="">Select</option>
//                   {jointTaxItem.map((itm) => (
//                     <option key={itm.name} value={itm.name}>
//                       {itm.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//               <td>
//                 <input readOnly value={item.description} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
//                 />
//               </td>
//               <td>
//                 <input readOnly value={item.unitOfMeasure} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.itemPrice} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.discountWholesale} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.tax.toFixed(2)} className="bg-gray-200" />
//               </td>
//               <td>
//                 <input readOnly value={item.total.toFixed(2)} className="bg-gray-200" />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         className="mt-2 text-blue-600 underline"
//         onClick={addNewItemRow}
//       >
//         + Add Item
//       </button>
//     </div>
//   );
// };

// export default Page;
