"use client"
import axios from 'axios'
import React,{useState,useEffect, useCallback, FormEvent} from 'react'
import { useRouter } from "next/navigation";
type Currency = {
  currencyCode: string;
  currencyName: string;
};
type Salesperson = {
  id: number;
  firstName: string;
  salesCode: string;
  phone?: string;
  email?: string;
};
type Bank = {
  bankName: string;
  bankCode: string;
};
type salesarea ={
  code:string,
  name:string
}
interface Branch {
  name: string;
}
type customer ={
  customerCode:string
}

type Payment = {
  id: string;
  name: string;
  // Add other fields if needed
};

type method = {
  name:string,
  code:string
}

type salescategorie = {
  code:string,
  name:string
}

type client ={
  customerName:string,
  customerInitials:string,
  address:string,
  kraPin:string,
  currency:string,
  isActive:boolean,
  phone1:string,
  phone2:string,
  email:string,
  bankName:string,
  accountNumber:string,
  salesPerson:string,
  discountEliginility:boolean,
  branchName:string,
  salesArea:string,
  salesType:string,
comment:string,
customerId:string,
preferedPaymentMethod:string,
sex:string,
allowedDiscount:string,
creditLimit:string,
paymentTerms:string,
refNo:string
}

const initialStatus ={
    customerName:"",
  customerInitials:"",
  address:"",
  kraPin:"",
  currency:"",
  isActive:false,
  phone1:"",
  phone2:"",
  email:"",
  bankName:"",
  accountNumber:"",
  salesPerson:"",
  discountEliginility:false,
  branchName:"",
  salesArea:"",
  salesType:"",
comment:"",
customerId:"",
preferedPaymentMethod:"",
sex:"",
allowedDiscount:"",
creditLimit:"",
paymentTerms:"",
refNo:""
}

const page = () => {
  const router = useRouter();
    const [curr, setCurr] = useState<Currency[]>([])
    const fetchCurrencies = async()=>{
         
const response = await axios.get("/api/auth/currency")
console.log("Currency API response:", response.data);
        setCurr(response.data)
        
    }

     const [branches, setBranches] = useState<Branch[]>([]);
   const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/addbranch");
     setBranches(response.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);
    
     const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");

  const fetchBanks = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/bankname");
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  }, []);


  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [selectedPersonName, setSelectedPersonName] = useState<string>("");

  const fetchSalespersons = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/salesperson");
      setSalespersons(res.data);
    } catch (error) {
      console.error("Failed to fetch salespersons:", error);
    }
  }, []);
  useEffect(() => {
    fetchBanks();
    fetchCurrencies()
      fetchSalespersons();
  }, []);
const [areasales, setAreaSales] = useState<salesarea[]>([])
const fetchSalesAreas = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/salesarea");
      setAreaSales(res.data);
    } catch (error) {
      console.error("Error fetching sales areas", error);
    }
  }, []);

  useEffect(() => {
    fetchSalesAreas();
  }, [fetchSalesAreas]);
 

  const [addClient, setAddClient] = useState<client>(initialStatus)
// Utility to generate unique sales code
const generateSalesCode = (prefix: string = "CLT", length: number = 4): string => {
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
};

 useEffect(() => {
    setAddClient((prev) => ({
      ...prev,
      refNo: generateSalesCode(),
    }));
  }, []);

const [paymentTerms, setPaymentTerms] = useState<Payment[]>([])
 const fetchPaymentTerms = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/payment-terms"); // Adjust path if needed
      setPaymentTerms(response.data);
    } catch (error) {
      console.error("Failed to fetch payment terms:", error);
    }
  }, []);

  useEffect(() => {
    fetchPaymentTerms();
  }, [fetchPaymentTerms]);


  const [paymentMeth, setpaymentMeth] = useState<method[]>([])
   const fetchPaymentMethods = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/paymentmethod");
      setpaymentMeth(res.data);
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);


  const [salescategory, setSalesCategory] = useState<salescategorie[]>([])
    const fetchSalesCategories = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/sales-category");
      setSalesCategory(res.data); // Adjust if API returns a nested structure
    } catch (error) {
      console.error("Failed to fetch sales categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchSalesCategories();
  }, [fetchSalesCategories]);


 
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  const fieldValue =
    type === 'checkbox' && e.target instanceof HTMLInputElement
      ? e.target.checked
      : value;

  setAddClient((prev) => ({
    ...prev,
    [name]: fieldValue,
  }));
};

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const handleAddClient = async (e:FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      console.log("see",addClient);
      
      const response = await axios.post("/api/auth/addclient", addClient);
      if (response.status === 201 || response.status === 200) {
        setSuccess("✅ Client added successfully");
        setAddClient(initialStatus); // Reset form
      } else {
        setError("⚠️ Failed to add client");
      }
    } catch (err) {
      console.error(err);
      setError("❌ An error occurred while adding client");
    }
  };

 useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);
return(
    // container
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
<h4 className='text-base font-semibold ml-2 mt-2 text-[#176472]'>Create New Customer or Edit Existing</h4>
{/* search sort palace */}
<div>
    
</div>
{/* content */}
<form className='border-black border-[1px] w-100% m-3 rounded-md h-fit' onSubmit={handleAddClient}>
    {/* inner content */}
    <div className='border-black border-[1px] w-100% m-2 flex justify-center gap-48 px-11 py-6 rounded-md h-fit'>
        {/* left content */}
        <div>
            <div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Customer Name:</label>
    <input type='text' onChange={handleChange} name='customerName' value={addClient.customerName} className='bg-[#D9D9D9] h-6 rounded-md placeholder-red-500' aria-placeholder='john Doe'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Customer Initials:</label>
    <input type='text' onChange={handleChange} name='customerInitials' value={addClient.customerInitials} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='J.D'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Address:</label>
    <input type='text' onChange={handleChange} name='address' value={addClient.address} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='nairobi,kenya'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>KRA pin:</label>
    <input type='text' name='kraPin' value={addClient.kraPin} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' minLength={12} maxLength={12} required aria-placeholder='#A2343456798B'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Currency:</label>
    <select name="currency" value={addClient.currency} id="" onChange={handleChange} aria-placeholder='usd'>
        <option value="">Select Currency</option>
        {curr.map((currency, index) => (
      <option key={index} value={currency.currencyCode}>
        {currency.currencyName} ({currency.currencyCode})
      </option>
    ))}
    </select>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>IsActive:</label>
    <input type='checkbox' name='isActive' checked={addClient.isActive} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='discountEligibility'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Phone 1:</label>
    <input type='text' name='phone1' value={addClient.phone1} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='enter phone 1'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Phone 2:</label>
    <input type='text' name='phone2' value={addClient.phone2} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='enter phone 2'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>email:</label>
    <input type='text' name='email' value={addClient.email} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='email'/>
</div>
 <div className="flex justify-end gap-2 mb-1">
      <label className="text-sm text-black">Bank Name:</label>
      <select
        name="bankName"
        value={addClient.bankName}
        onChange={handleChange}
        className="bg-[#D9D9D9] h-6 rounded-md pl-2 text-sm text-black"
      >
        <option value="">Select Bank</option>
        {banks.map((bank) => (
          <option key={bank.bankCode} value={bank.bankName}>
            {bank.bankName}
          </option>
        ))}
      </select>
    </div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Account Number:</label>
    <input type='text' name='accountNumber' value={addClient.accountNumber} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='accountnumber'/>
</div>
{/* <div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Sales Person:</label>
     <select name="" id="" arial-placeholder="salesPerson">
        <option value="">Select Currency</option>
        <option value="">1</option>
    </select>
</div> */}


 <div className="flex justify-end gap-2 mb-1">
      <label className="text-sm text-black">Sales Person:</label>
      <select
        name="salesPerson"
        id="salesPerson"
        value={addClient.salesPerson}
       onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
        aria-placeholder="salesPerson"
      >
        <option value="">Select Sales Person</option>
        {salespersons.map((sp) => (
          <option key={sp.salesCode} value={sp.firstName}>
            {sp.firstName}
          </option>
        ))}
      </select>
    </div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Discount Eligibility:</label>
    <input type='checkbox' name='discountEliginility' checked={addClient.discountEliginility} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='discountEligibility'/>
</div>
        </div>
        {/* right content */}
        <div>
            <div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Branch Name:</label>
     <select name="branchName" value={addClient.branchName} id="" onChange={handleChange} aria-placeholder='branchName'>
       
         <option value="">Select Branch</option>
        {branches.map((branch, index) => (
          <option key={index} value={branch.name}>
            {branch.name}
          </option>))}
    </select>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Sales Area:</label>
     <select name="salesArea" value={addClient.salesArea} onChange={handleChange} aria-placeholder='salesArea'>
        <option value="">Select Sales Area</option>
        {areasales.map((area) => (
          <option key={area.code} value={area.name}>
            {area.name} ({area.code})
          </option>
        ))}
    </select>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Sales Type:</label>
     <select name="salesType" value={addClient.salesType} onChange={handleChange} aria-placeholder='Sales-Category'>
        <option value="">Select Category</option>
        {salescategory.map((category) => (
        <option key={category.code} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
</div>
          <div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Comment:</label>
    <textarea name="comment" value={addClient.comment} onChange={handleChange} aria-placeholder='comment' cols={30} rows={4}>Enter comment</textarea>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Customer ID:</label>
    <input type='text' name='customerId' value={addClient.customerId} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='ID'/>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Prefered Payment Method:</label>
     <select name="preferedPaymentMethod" value={addClient.preferedPaymentMethod} onChange={handleChange} id="" aria-placeholder='paymentMethod'>
        <option value="">Select method</option>
         {paymentMeth.map((method) => (
        <option key={method.code} value={method.name}>
          {method.name}
        </option>
      ))}
    </select>
</div>

<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Sex:</label>
    <select name="sex" value={addClient.sex} onChange={handleChange} id="" aria-placeholder='sex'>
        <option value="">Pick Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="default">Prefer not to Say</option>
    </select>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Allowed Discount:</label>
    <input type='text' name='allowedDiscount' value={addClient.allowedDiscount} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='discountAllowed' />
</div>
          <div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>Credit Limit:</label>
    <input type='text' name='creditLimit' value={addClient.creditLimit} onChange={handleChange} className='bg-[#D9D9D9] h-6 rounded-md' aria-placeholder='creditLimit' />
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>payment Terms:</label>
    <select name="paymentTerms" value={addClient.paymentTerms} onChange={handleChange} aria-placeholder='paymentTerm' >
        <option value="">-- Select Payment Term --</option>
        {paymentTerms.map((term) => (
          <option key={term.id} value={term.name}>
            {term.name}
          </option>
        ))}
    </select>
</div>
<div className='flex justify-end gap-2 mb-1'>
    <label className='text-sm text-black'>RefNo:</label>
    <input type='text' onChange={handleChange} name='refNo' value={addClient.refNo} className='bg-[#D9D9D9] h-6 rounded-md' readOnly />
</div>
        </div>
    </div>
    <button className='bg-[#4E803F] ml-[50%] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md'>➕ submit</button>
    
</form>
<button className='bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md' onClick={() => router.back()}>❌ back</button>

{success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-md z-10">
          {error}
        </div>
      )}
    </div>
  )
}

export default page