"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'

type SaleEntryData = {
  client: {
    customerName: string
    customerInitials: string
    allowedDiscount: number
    creditLimit: number
    email: string
    kraPin: string
    paymentTerms: string
    phone1: string
    sex: string
    salesArea: string
    preferedPaymentMethod: string
    refNo: string
  }
  salesEntryItems: {
    itemId: string
    itemName: string
    quantity: number
    salesEntryId: string
    tax: number
    total: number
    unitPrice: number
    updatedAt: string
  }[]
  shipping: number
  status: string
  subtotal: number
  updatedAt: string
  grandTotal:string
}

const Page = () => {
  const route = useRouter()
  const [deliveryItem, setDeliveryItem] = useState<SaleEntryData | null>(null)

  useEffect(() => {
    const dt = localStorage.getItem("InvoiceSaleEntryData")
    if (dt) {
      try {
        const parsedData = JSON.parse(dt)
        if (parsedData && typeof parsedData === "object") {
          setDeliveryItem(parsedData)
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error)
      }
    }
  }, [])


const handleStatusChange = async () => {
  try {
    if (!deliveryItem) return;

    const response = await axios.patch("/api/auth/sales-entry", {
      salesEntryId: deliveryItem.salesEntryItems[0].salesEntryId, // get the ID from the first item
      status: "Invoiced"
    });

    if (response.status === 200) {
      alert("Status updated successfully!");
      route.back();
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status.");
  }
};

  return (
    <div>
      {deliveryItem ? (
        <div className='bg-[#EFEFEF] m-1 rounded-md p-1 h-fit'>
            <div className='border-[1px] border-black mx-1 rounded-md mt-4 mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Customer Information</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-2 mx-1 rounded-md flex gap-10 pt-1'>
    {/* left section */}
<div className='flex flex-col ml-4'>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Customer Name:</label>
    <input type='text'readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.customerName}/>
</div>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Customer Initials:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.customerInitials}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Allowed Discount:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.allowedDiscount}/>
</div>
</div>
{/* middle section */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Credit Limit:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.creditLimit}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Sex:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.sex}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Phone:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.phone1}/>
</div>
</div>
{/* added */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Terms:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.paymentTerms}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>email:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.email}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>KRA Pin:</label>
    <input type='text' readOnly className='my-[1px] w-52 bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.kraPin}/>
</div>
</div>
{/* right section */}
<div >
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Reference No:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.refNo}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Sales Area:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.salesArea}/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>paymentMethod:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' value={deliveryItem.client.preferedPaymentMethod}/>
</div>
</div>
</div>

       <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
  <h6 className='px-2 py-1 font-semibold text-sm text-black'>Quotation Items</h6>
<table className='border-[1px] border-black mb-2 mx-1 rounded-md w-[99%] table-auto'>
    <thead className='bg-gray-100'>
      <tr className='text-sm bg-[#099EBA] text-white'>
        <th className='border px-2 py-1'>Item Code</th>
        <th className='border px-2 py-1'>Item Name</th>
        <th className='border px-2 py-1'>Quantity</th>
        <th className='border px-2 py-1'>Entry Id</th>
        <th className='border px-2 py-1'>Tax</th>
        <th className='border px-2 py-1'> Total</th>
        <th className='border px-2 py-1'>Unit Price</th>
        <th className='border px-2 py-1'>Updated At</th>
   
      </tr>
    </thead>
    <tbody>
{deliveryItem?.salesEntryItems?.map((val, idx) => (
      <tr key={idx} className="text-sm">
        <td className='border px-2 py-1'>{val.itemId}</td>
        <td className='border px-2 py-1'>{val.itemName}</td>
        <td className='border px-2 py-1'>{val.quantity}</td>
        <td className='border px-2 py-1'>{val.salesEntryId}</td>
        <td className='border px-2 py-1'>{val.tax}</td>
        <td className='border px-2 py-1'>{val.total}</td>
        <td className='border px-2 py-1'>{val.unitPrice}</td>
        <td className='border px-2 py-1'>{new Date(val.updatedAt).toLocaleString()}</td>
      </tr>
    ))}
    <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Shipping Amount: {deliveryItem.shipping}</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Sub-Total: {deliveryItem.subtotal}</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'> Final Amount: {deliveryItem.grandTotal}</td>
      </tr>
    </tbody>
    </table>
            </div>
{/* bottom */}
            <div className='flex justify-center my-2'>
              <label >Remarks</label>
              <textarea id="" cols={30} rows={4} className='border-black border'></textarea>
            </div>
              </div>
                <div className='flex gap-5 justify-center'>
                <button type='submit' className='bg-[#4E803F] text-sm font-semibold px-3 py-[1px] text-white rounded-md' onClick={handleStatusChange}>Process Dispatch</button>
                <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md' onClick={()=>route.back()}>Cancel Dispatch</button>

            </div>
              </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Page
