"use client"
import React from 'react'
const Page =()=>{
    return(
        // container
        <div className='bg-[#EFEFEF] m-1 rounded-md p-1 h-fit'>
            <h4 className='text-black font-medium ml-1 text-sm '>New Direct Sales Order Entry</h4>
            {/* upper section */}
            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Customer Information</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-14 pt-1'>
    {/* left section */}
<div className='flex flex-col ml-4'>
<div className='flex gap-1 justify-center'>
    <label className='text-sm text-black'>Customer:</label>
    <select name="" id="" className='my-[1px] bg-[#f5c5c5]'>
        <option value="">Select Customer</option>
           <option value="">Customer 1</option>
           <option value="">Customer 1</option>
    </select>
</div>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Branch Name:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>

<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Ref No:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
</div>
{/* middle section */}
<div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Credit Limit:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Discount Allowed:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Quotation Date:</label>
    <input type='text' readOnly className='my-[1px] bg-[#D1CBCB] rounded-sm h-5'/>
</div>
</div>
{/* right section */}
<div >
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Time:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Price Listing:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5'/>
</div>
<div className='flex gap-1 justify-end'>
    <label className='text-sm text-black'>Payment Method:</label>
    <input type='text' readOnly className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5'/>
</div>
</div>
</div>
            </div>
            {/* Table Section */}
           <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
  <h6 className='px-2 py-1 font-semibold text-sm text-black'>Direct Sale Order Items</h6>

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
      <tr>
    <td className='border px-2 py-1'>
      <input type='text' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <select className='w-full px-1 py-0.5 border bg-[#f5c5c5] h-6 rounded-sm'>
        <option value="">Select Item</option>
        <option value="item1">Item 1</option>
        <option value="item2">Item 2</option>
        <option value="item3">Item 3</option>
      </select>
    </td>

    <td className='border px-2 py-1'>
      <input type='text' className='my-[1px]  bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <input type='number' className='w-20   bg-[#f5c5c5] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <input type='text' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <input type='number' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <input type='number' className='w-20  bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
      <input type='number' className='w-20   bg-[#D1CBCB] rounded-sm h-5' />
    </td>

    <td className='border px-2 py-1'>
    <input type='number' className='w-20  bg-[#D1CBCB] rounded-sm h-5' />
    </td>
    <td>
        🚮
    </td>
      </tr>

      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Shipping Amount: 0.00</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Sub-Total: 0.00</td>
      </tr>
      <tr className='border'>
        <td colSpan={10} className='text-end px-4 py-1 text-sm text-black font-semibold'>Final Amount: 0.00</td>
      </tr>
    </tbody>
  </table>

  <h6 className='text-start px-2 text-sm font-serif font-bold py-1 cursor-pointer text-blue-600 hover:underline'>
    + Add Item
  </h6>
</div>



                      {/* lower section */}
            <div className='border-[1px] border-black mx-1 rounded-md mb-2'>
<h6 className='text-center text-sm text-black font-semibold'>Direct Sale Order Delivery Details</h6>
{/* innerbody container */}
<div className='border-[1px] border-black mb-[2px] mx-1 rounded-md flex gap-32 justify-center '>
    {/* left section */}
<div className='py-1'>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Delivery From:</label>
    <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Location</option>
           <option value="">Customer 1</option>
           <option value="">Customer 1</option>
    </select>
</div> 

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Due Date:</label>
    <input type='date' className='bg-[#D9D9D9] h-6 rounded-md'/>
</div>

<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Vehicle:</label>
   <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Customer</option>
           <option value="">Customer 1</option>
           <option value="">Customer 1</option>
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Driver:</label>
    <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Customer</option>
           <option value="">Customer 1</option>
           <option value="">Customer 1</option>
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Trip:</label>
    <select name="" id="" className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'>
        <option value="">Select Customer</option>
           <option value="">Customer 1</option>
           <option value="">Customer 1</option>
    </select>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Accompanied by:</label>
    <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Address:</label>
    <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
</div>
{/* right section */}
<div className='pt-1'>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Phone Number::</label>
    <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Customer reference:</label>
    <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md' aria-readonly/>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Comment:</label>
    
    <textarea name="" id="" cols={30} rows={3} className='my-[1px] bg-[#D9D9D9] rounded-md'></textarea>
</div>
<div className='flex justify-end gap-2'>
    <label className='text-sm text-black'>Offloading:</label>
    <input type='text' className='my-[1px] bg-[#D9D9D9] h-6 rounded-md'/>
</div>
</div>
</div>
            </div>

            {/* control Buttons */}
            <div className='flex gap-5 justify-center'>
                <button className='bg-[#4E803F] text-sm font-semibold px-3 py-[1px] text-white rounded-md'>Add Direct Sale Order</button>
                <button className='bg-[#E75D5D] text-sm px-3 py-[1px] font-semibold text-white rounded-md'>Cancel Direct Sale Order</button>

            </div>
        </div>
    )
}
export default Page;