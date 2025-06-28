"use client"
import axios from 'axios'
import { Trash2 } from "lucide-react";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
type clientie ={
  id:string;
customerName:string,
branchName:string,
refNo:string,
creditLimit:string,
allowedDiscount:string,
paymentTerms:string,
preferedPaymentMethod:string,
salesType:string,
phone1:string,
email:string,
customerId:string,
kraPin:string,
}
type branchie = {
  branchCode:string,
          name: string,
}

type vehicle ={
  plateNumber:string,
  model: string,
}

type fahrer = {
  licenseNumber: string,
  userName: string,
}

type shiftie ={
  shiftName: string;
  shiftCode: string;
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
  
  deliveryFrom:string;
  dueDate:string;
  vehicle:string;
  driver:string;
  trip:string;
  accompaniedBy:string;
  address:string;
  phoneNumber:string;
  customerReference:string;
  comment:string;
  destination:string;
  offload:boolean;
  prepay:boolean
}
const initialState: lowrie = {
  deliveryFrom: "",
  dueDate: "",
  vehicle: "",
  driver: "",
  trip: "",
  accompaniedBy: "",
  address: "",
  phoneNumber: "",
  customerReference: generateCode(),
  comment: "",
  destination: "",
  offload: false,
  prepay:false
};
const Page =()=>{
const [selectedClient, setSelectedClient] = useState<clientie | null>(null);
  const [clients, setclient] = useState<clientie[]>([])
  const [drivers, setDrivers] = useState<fahrer[]>([]);
  const [vehicles, setVehicles] = useState<vehicle[]>([])
  const [shift, setShift] = useState<shiftie[]>([])
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
        const customerName = event.target.value;
        const client = clients.find(client => client.customerName === customerName);
        setSelectedClient(client || null);
    };
 const fetchItem = useCallback(async()=>{
     try {
      const [itmRes,vehicleRes,driverRes,shiftRes,branchres,clientRes] = await Promise.all([
axios.get("/api/auth/items-creation"),
axios.get("/api/auth/addvehicle"),
axios.get("/api/auth/adddriver"),
axios.get("/api/auth/addshift"),
axios.get("/api/auth/addbranch"),
axios.get("/api/auth/addclient")
      ])
      
      setitemized(itmRes.data);
      setVehicles(vehicleRes.data);
      setDrivers(driverRes.data);
      setShift(shiftRes.data);
      setBranch(branchres.data);
setclient(clientRes.data)
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
const handleDeliveryChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  // Only access `.checked` if it's an input and a checkbox
  const newValue =
    (name === "offload" || name === "prepay") && type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;

  setDelivery((prevDelivery) => ({
    ...prevDelivery,
    [name]: newValue,
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
    clientId: selectedClient?.id, // Ensure this is valid
    deliveryDetails: {
      address: delivery.address,
      deliveryFrom: delivery.deliveryFrom,
      vehicleId: delivery.vehicle,
      driverId: delivery.driver,
      shiftId: delivery.trip,
      customerReference: delivery.customerReference,
      comment: delivery.comment || "",
      phoneNumber: delivery.phoneNumber,
      accompaniedBy: delivery.accompaniedBy,
      destination: delivery.destination,
      deliveryDate: new Date(delivery.dueDate), // Ensure this is a valid date
      offload:delivery.offload,
      prepay:delivery.prepay
    },
    subtotal: formattedsubtotalAmount,
    shipping: shipping,
    grandTotal: formattedFinalAmount,
    remarks: delivery.comment || "",
    status: "Direct-Sale",
    salesEntryItems: itemsTable.map((item) => ({
        itemId: item.code, // Ensure this is valid
        itemName: item.name, // Required
        quantity: item.quantity,
        unitPrice: item.itemPrice,
        total: item.total,
        discount: item.discountWholesale ?? 0,
        tax: item.tax ?? 0,
      })),
    
  };

  console.log("payload:",payload);

  try {
    const res = await axios.post("/api/auth/sales-entry", payload);

    if (res.status === 200 || res.status === 201) {
  
      // Reset form if needed:
      setDelivery(initialState);
      setSelectedClient(null);
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
            <h4 className='text-black font-medium ml-1 text-sm '>New Direct Sales Entry</h4>
            {/* upper section */}
            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Customer Information</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-10 pt-1'>
    {/* left section */}
<div className='flex flex-col ml-4'>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Customer:</label>
    <select onChange={handleClientChange} className='my-[1px] w-52 bg-[#f5c5c5]'>
        <option value="">Select Customer</option>
           {clients.map((value)=>(
            <option key={value.id} value={value.customerName}>{value.customerName}</option>
           ))}
    </select>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Branch Name:</label>
    <input type='text' value={selectedClient?.branchName || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Ref No:</label>
    <input type='text' value={selectedClient?.refNo || ''} readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
</div>
{/* middle section */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Credit Limit:</label>
    <input type='text' readOnly value={selectedClient?.creditLimit || ''} className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Discount Allowed:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.allowedDiscount || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Phone:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.phone1 || ''}/>
</div>
</div>
{/* added */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>ID No:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.customerId || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>email:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.email || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>KRA Pin:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.kraPin || ''}/>
</div>
</div>
{/* right section */}
<div >
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Terms:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.paymentTerms || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Sales Types:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.salesType || ''}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Method:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={selectedClient?.preferedPaymentMethod || ''}/>
</div>
</div>
</div>
            </div>
            {/* Table Section */}
           <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
  <h6 className='px-2 py-1 font-semibold text-sm text-black'>Items to Sell</h6>
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
<h6 className='text-center text-sm text-black font-semibold'>Direct Sale Delivery Details</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-32 justify-center '>
    {/* left section */}
<div className='py-1'>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Delivery From:</label>
    <select onChange={handleDeliveryChange} name="deliveryFrom" value={delivery.deliveryFrom} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Branch</option>
           {branch.map((value)=>(
            <option key={value.branchCode} value={value.name}>{value.name}</option>
           ))}
    </select>
</div> 

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Due Date:</label>
    <input type='date' name="dueDate" value={delivery.dueDate} onChange={handleDeliveryChange} className='bg-[#D9D9D9] h-6 rounded-md'/>
</div>

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Vehicle:</label>
   <select onChange={handleDeliveryChange} name='vehicle' value={delivery.vehicle} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Vehicle</option>
                 {vehicles.map((d) => (
    <option key={d.plateNumber} value={d.plateNumber}>
      {d.model} ({d.plateNumber})
    </option>
  ))}
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Driver:</label>
    <select onChange={handleDeliveryChange} name='driver' value={delivery.driver} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
         <option value="">Select Driver</option>
               {drivers.map((d) => (
    <option key={d.licenseNumber} value={d.licenseNumber}>
      {d.userName}
    </option>
  ))}
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Trip:</label>
    <select onChange={handleDeliveryChange} name='trip' value={delivery.trip} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Shift</option>
          {shift.map((val)=>(<option key={val.shiftCode} value={val.shiftCode}>{val.shiftName}</option>))}
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Accompanied by:</label>
    <input type='text' name='accompaniedBy' value={delivery.accompaniedBy} onChange={handleDeliveryChange} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Address:</label>
    <input type='text' name='address' value={delivery.address} onChange={handleDeliveryChange} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
</div>
{/* right section */}
<div className='pt-1'>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Phone Number::</label>
    <input type='text' name='phoneNumber' value={delivery.phoneNumber} onChange={handleDeliveryChange} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Delivery reference:</label>
    <input type='text' onChange={handleDeliveryChange} name='customerReference' value={delivery.customerReference} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md' aria-readonly/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Comment:</label>
    
    <textarea onChange={handleDeliveryChange} name='comment' value={delivery.comment} cols={30} rows={3} className='my-[1px] bg-[#D9D9D9] rounded-md'></textarea>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Destination:</label>
    <input type='text' onChange={handleDeliveryChange} name="destination" value={delivery.destination} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Offload:</label>
    <input type='checkbox' onChange={handleDeliveryChange} name='offload' checked={delivery.offload} className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>

    <label className='text-sm text-black'>Prepay:</label>
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