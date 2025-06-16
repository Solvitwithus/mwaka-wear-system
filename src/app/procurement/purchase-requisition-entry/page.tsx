"use client"
import axios from 'axios'
import { Trash2 } from "lucide-react";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
type supplierie ={
  id:string;
name:string,
paymentTerm:string,
bankName:string,
creditLimit:string,
 accountNumber:string,
blacklisted:string,
preferredPaymentMethod:string,
website:string,
phone:string,
email:string,
code:string,
kra:string,
}
type branchie = {
  branchCode:string,
          name: string,
}







type itemie = {
   code: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  itemPrice: number;
  discountWholesale: number;
   taxAmount: number;


}

const generateCode = (): string => {
  const chars = "DEL0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};
type lowrie = {
  
  deliverTo:string;
  reqDate:string;
  dueDate:string;
  isDelivered:boolean;
  isUrgent:boolean;
  comment:string;
  offload:boolean;
   prepay:boolean;
}
const initialState: lowrie = {
 deliverTo:"",
  reqDate:"",
  dueDate:"",
  isDelivered:false,
  isUrgent:false,
  comment:"",
  offload:false,
   prepay:false,
};
const Page =()=>{
const [selectedSupplier, setSelectedSupplier] = useState<supplierie| null>(null);
  const [suppliers, setSuppliers] = useState<supplierie[]>([])

  const [delivery, setDelivery] = useState<lowrie>(initialState)
  const [itemized, setitemized] = useState<itemie[]>([])
  const [branch, setBranch] = useState<branchie[]>([])

  // added
  const [itemsTable, setItemsTable] = useState([
    {
      name: "",
      code: "",
      description: "",
      unitOfMeasure: "",
      itemPrice: 0,
      discountWholesale: 0,
      fixedAmount: 0,
      quantity: 1,
      tax: 0,
      total: 0,
    },
  ]);
  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const supplierName = event.target.value;
        const client = suppliers.find(supplier => supplier.name === supplierName);
        setSelectedSupplier(client || null);
    };
 const fetchItem = useCallback(async()=>{
     try {
      const [itmRes,branchres,supplierRes] = await Promise.all([
axios.get("/api/auth/items-creation"),
axios.get("/api/auth/addbranch"),
axios.get("/api/auth/add-supplier")
      ])
      
      setitemized(itmRes.data);
      setBranch(branchres.data);
setSuppliers(supplierRes.data)
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  },[])



  useEffect(()=>{fetchItem()},[fetchItem])

  const calculateTotal = (
  quantity: number,
  price: number,
  discount: number,
  tax: number
) => {
  const subtotal = quantity * price;
  const discountAmount = (discount / 100) * subtotal;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (tax / 100) * taxableAmount;
  return taxableAmount + taxAmount;
};


const handleItemChange = (index: number, field: string, value: any) => {
  const updatedItems = [...itemsTable];

  if (field === "name") {
    const selected = itemized.find((itm) => itm.name === value);
    if (selected) {
      updatedItems[index] = {
        ...updatedItems[index],
        name: selected.name,
        code: selected.code,
        description: selected.description,
        unitOfMeasure: selected.unitOfMeasure,
        itemPrice: selected.itemPrice,
        discountWholesale: selected.discountWholesale,
        tax: selected.taxAmount,
        total: calculateTotal(
          1,
          selected.itemPrice,
          selected.discountWholesale,
          selected.taxAmount
        ),
      };
    }
  } else if (field === "quantity") {
    const qty = parseFloat(value) || 1;
    const item = updatedItems[index];
    updatedItems[index] = {
      ...item,
      quantity: qty,
      total: calculateTotal(
        qty,
        item.itemPrice,
        item.discountWholesale,
        item.tax
      ),
    };
  }

  setItemsTable(updatedItems);
};

const deleteItemRow = (index: number) => {
  const updated = [...itemsTable];
  updated.splice(index, 1);
  setItemsTable(updated);
};


  const addNewItemRow = () => {
    setItemsTable([
      ...itemsTable,
      {
        name: "",
        code: "",
        description: "",
        unitOfMeasure: "",
        itemPrice: 0,
        discountWholesale: 0,
        fixedAmount: 0,
        quantity: 1,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const subTotal = itemsTable.reduce((sum, item) => sum + item.total, 0);
const shipping = 345.00;
const finalAmount = subTotal + shipping;

const formattedFinalAmount = parseFloat(finalAmount.toFixed(2)); 
const formattedsubtotalAmount = parseFloat(subTotal .toFixed(2)); 
  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement > ) => {
    const { name, value, type } = e.target;

    // Handle boolean specifically for the 'offload' property
    const newValue = name === "isDelivered" || name === "isUrgent" || name === "offload" || name ==="prepay" ? e.target.checked : value;

    setDelivery((prevDelivery) => ({
      ...prevDelivery,
      [name]: newValue
    }));
  };

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

const handleQuotqtionAdd = async (e: FormEvent) => {
  e.preventDefault();

  const payload = {
    supplierId: selectedSupplier?.id, // Ensure this is valid
    purchaseAdditionalInfo: {
   deliverTo:delivery.deliverTo,
  reqDate:delivery.reqDate,
  dueDate:delivery.dueDate,
  isDelivered:delivery.isDelivered,
  isUrgent:delivery.isUrgent,
  comment:delivery.comment,
  offload:delivery.offload,
   prepay:delivery.prepay,
    },
    subtotal: formattedsubtotalAmount,
    shipping: shipping,
    grandTotal: formattedFinalAmount,
    remarks: delivery.comment || "",
    status: "purchase-requisition-entry",
    PurchaseRequisitionEntryItems: itemsTable.map((item) => ({
        itemId: item.code, // Ensure this is valid
        itemName: item.name, // Required
        quantity: item.quantity,
        unitPrice: item.itemPrice,
        total: item.total,
        discount: item.discountWholesale ?? 0,
        tax: item.tax ?? 0,
      })),
    
  };




  try {
    const res = await axios.post("/api/auth/purchase-quotation-entry", payload);

    if (res.status === 200 || res.status === 201) {
  
      // Reset form if needed:
      setDelivery(initialState);
      setSelectedSupplier(null);
      setItemsTable([ /* reset item table */ ]);
       setSuccess(res.data.message)
    } else {
      console.error("Unexpected response:", res);
      setError(res.data.error)
     
    }
  } catch (error) {
    console.error("Error submitting quotation:");
    alert("An error occurred while submitting the quotation.");
  }
};
    return(
        // container
        <div className='bg-[#EFEFEF] m-1 rounded-md p-1 h-fit'> <form onSubmit={handleQuotqtionAdd}>
            <h4 className='text-black font-medium ml-1 text-sm '>New Purchase Requisition Entry</h4>
            {/* upper section */}
            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Supplier Information</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-10 pt-1'>
    {/* left section */}
<div className='flex flex-col ml-4'>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Supplier:</label>
    <select onChange={handleClientChange} className='my-[1px] w-52 bg-[#f5c5c5]'>
        <option value="">Select Suppier</option>
           {suppliers.map((value)=>(
            <option key={value.id} value={value.name}>{value.name}</option>
           ))}
    </select>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>payment Terms:</label>
    <input type='text' value={selectedSupplier?.paymentTerm || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>bank Name:</label>
    <input type='text' value={selectedSupplier?.bankName || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
</div>
{/* middle section */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Credit Limit:</label>
    <input type='text' readOnly value={selectedSupplier?.creditLimit || ''} className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Account Number:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.accountNumber || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Phone:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.phone || ''}/>
</div>
</div>
{/* added */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Blacklisted:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.blacklisted || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>email:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.email || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>KRA Pin:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.kra || ''}/>
</div>
</div>
{/* right section */}
<div >
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Method:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.preferredPaymentMethod || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Website URL:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.website || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Supplier Code:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedSupplier?.code|| ''}/>
</div>
</div>
</div>
            </div>
            {/* Table Section */}
           <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
  <h6 className='px-2 py-1 font-semibold text-sm text-black'>Items to purchase</h6>
<table className='border-[1px] border-black mb-2 mx-1 rounded-md w-[99%] table-auto'>
    <thead className='bg-gray-100'>
      <tr className='text-sm bg-[#099EBA] text-white'>
        <th className='border px-2 py-1'>Item Code</th>
        <th className='border px-2 py-1'>Item Name</th>
        <th className='border px-2 py-1'>Item Description</th>
        <th className='border px-2 py-1'>Quantity</th>
        <th className='border px-2 py-1'>Unit</th>
        <th className='border px-2 py-1'>Price before tax</th>
        <th className='border px-2 py-1'>Discount</th>
        <th className='border px-2 py-1'>Tax</th>
        <th className='border px-2 py-1'>Total</th>
        <th className='border px-2 py-1'>Action</th>
      </tr>
    </thead>
    <tbody>
{itemsTable.map((item, idx) => (
            <tr key={idx}>
              <td className='border px-2 py-1'>
                <input readOnly value={item.code} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <select
                  value={item.name} className='w-full px-1 py-0.5 border bg-[#f5c5c5] h-6 rounded-sm'
                  onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                >
                  <option value="">Pick Item</option>
                  {itemized.map((itm) => (
                    <option key={itm.code} value={itm.name}>
                      {itm.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border px-2 py-1'>
                <input readOnly value={item.description}  className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <input
                  type="number"
                  value={item.quantity} className='w-20   bg-[#f5c5c5] rounded-sm h-5'
                  onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                />
              </td>
              <td className='border px-2 py-1'>
                <input readOnly value={item.unitOfMeasure} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <input readOnly value={(item.itemPrice ?? 0).toFixed(2)} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <input readOnly value={item.discountWholesale} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <input readOnly  value={(item.tax ?? 0).toFixed(2)} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1'>
                <input readOnly value={(item.total ?? 0).toFixed(2)} className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
              </td>
              <td className='border px-2 py-1 text-center'>
  <button type='button' onClick={() => deleteItemRow(idx)} className="text-red-500 hover:text-red-700">
    <Trash2 size={16} />
  </button>
</td>
            </tr>
          ))}
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Shipping Amount: {shipping.toFixed(2)}</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Sub-Total: {subTotal.toFixed(2)}</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'> Final Amount: {finalAmount.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

<button type='button'
        className="mt-2 text-blue-600 underline"
        onClick={addNewItemRow}
      >
        + Add Item
      </button>
</div>
    {/* lower section */}
            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Miscelleneous Information</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-32 justify-center '>
    {/* left section */}
<div className='py-1'>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Requesting Branch:</label>
    <select onChange={handleDeliveryChange} name="deliverTo" value={delivery.deliverTo} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Branch</option>
           {branch.map((value)=>(
            <option key={value.branchCode} value={value.name}>{value.name}</option>
           ))}
    </select>
</div> 

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Purchase Requisition Date:</label>
    <input type='date' name="reqDate" value={delivery.reqDate} onChange={handleDeliveryChange} className='bg-[#D9D9D9] h-6 rounded-md'/>
</div>

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Deliver by:</label>
    <input type='date' name="dueDate" value={delivery.dueDate} onChange={handleDeliveryChange} className='bg-[#D9D9D9] h-6 rounded-md'/>
</div>


<div className='flex justify-end gap-2 items-center'>
    <label className='text-sm text-black'>isDelivered:</label>
    
    <input type='checkbox' name='isDelivered' checked={delivery.isDelivered} onChange={handleDeliveryChange} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2 items-center'>
    <label className='text-sm text-black'>isUrgent:</label>
    <input type='checkbox' name='isUrgent' checked={delivery.isUrgent} onChange={handleDeliveryChange} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
</div>
{/* right section */}
<div className='pt-1'>

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Comment:</label>
    
    <textarea onChange={handleDeliveryChange} name='comment' value={delivery.comment} cols={30} rows={3} className='my-[1px] bg-[#D9D9D9] rounded-md'></textarea>
</div>

<div className='flex justify-end gap-2 items-center'>
    <label className='text-sm text-black'>To be Offloaded:</label>
    <input type='checkbox' onChange={handleDeliveryChange} name='offload' checked={delivery.offload} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2 items-center'>    <label className='text-sm text-black'>Prepay:</label>
    <input type='checkbox' onChange={handleDeliveryChange} name='prepay' checked={delivery.prepay} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
</div>
</div>
            </div>

            {/* control Buttons */}
            <div className='flex gap-5 justify-center'>
                <button type='submit' className='bg-[#4E803F] text-sm font-semibold px-3 py-[1px] text-white rounded-md'>Add Quotation</button>
                <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md'>Cancel Quotation</button>

            </div> </form>
            {success && (
        <div className="fixed bottom-4 right-4 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          ❌ {error}
        </div>
      )}
        </div>
    )
}
export default Page;