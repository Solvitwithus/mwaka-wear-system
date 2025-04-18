"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import StudIcon from "@/assets/LinkBar.svg"
import Image from 'next/image';
import { usePermissionStore } from '@/store/usePermissionStore';
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'


type Permissions = {
  PointOfSale: boolean;
  printStatement: boolean;
  directSale: boolean;
  customerPostings: boolean;
  salesManPosting: boolean;
  customerCredit: boolean;
  customerCreditPayments: boolean;
  salesQuotationEntry: boolean;
  salesOrderEntry: boolean;
  deliveryAgainstSalesOrders: boolean;
  invoiceAgainstSalesDelivery: boolean;
  invoivePrepaidOrders: boolean;
  salesDashboard: boolean;
  salesQuotationInquiry: boolean;
  salesOrderInquiry: boolean;
  customerTransactions: boolean;
  returnInquiry: boolean;
  customerBalance: boolean;
  POSReport: boolean;
  salesmanDetailedListing: boolean;
  creditNoteListing: boolean;
  quickInventoryCheck: boolean;
  salesmanPostingRepot: boolean;
  invoiceListing: boolean;
  Payments: boolean;
  addAndManageCustomes: boolean;
  customerBranches: boolean;
  salesGroup: boolean;
  salesType: boolean;
  salesPerson: boolean;
  salesPersonTargets: boolean;
  salesArea: boolean;
  creditStatusSetup: boolean;
};

const page = () => {
  const searchParams = useSearchParams();

  const err = searchParams.get("error");
const [error, setError] = useState<string>("");
  useEffect(() => {
    if (err === "unauthorized") {
      
     setError("Unauthorized")}
  }, [err]);

  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading) return <p>Loading...</p>;
  if (!permissions) return <p>Unauthorized</p>;

  
 


// Operations
const menu =[
  {name:"Point of Sale (POS)",link:"/sales/pos",image:StudIcon,permission:"PointOfSale" },
  {name:"Print Statement",link:"/add-customer",image:StudIcon,permission:"printStatement"},
  {name:"Direct Sale",link:"/edit-customer",image:StudIcon,permission:"directSale"},
  {name:"Customer Postings",link:"/edit-customer",image:StudIcon,permission:"customerPostings"},
  {name:"Sales Man Posting",link:"/add-customer",image:StudIcon,permission:"salesManPosting"},
  {name:"Customer Credit",link:"/edit-customer",image:StudIcon,permission:"customerCredit"},
  {name:"Customer Credit Payments",link:"/edit-customer",image:StudIcon,permission:"customerCreditPayments"}
]


const submenu=[
  {name:"Sales Quotation Entry",link:"/edit-customer",image:StudIcon,permission:"salesQuotationEntry"},
  {name:"Sales Order Entry",link:"/edit-customer",image:StudIcon,permission:"salesOrderEntry"},
  {name:"Delivery Against Sales Orders",link:"/add-customer",image:StudIcon,permission:"deliveryAgainstSalesOrders"},
  {name:"Invoice Against Sales Delivery",link:"/edit-customer",image:StudIcon,permission:"invoiceAgainstSalesDelivery"},
  {name:"Invoive Prepaid Orders",link:"/edit-customer",image:StudIcon,permission:"invoivePrepaidOrders"}
]


// Reports and Inquiries Section
const reportsLeftItems=[
  {name:"Sales Dashboard",link:"/edit-customer",image:reportIcon,permission:"salesDashboard"},
  {name:"Sales Quotation Inquiry",link:"/edit-customer",image:reportIcon,permission:"salesQuotationInquiry"},
  {name:"Sales Order Inquiry",link:"/add-customer",image:reportIcon,permission:" salesOrderInquiry"},
  {name:"Customer Transactions",link:"/edit-customer",image:reportIcon,permission:"customerTransactions"},
  {name:"Return Inquiry",link:"/edit-customer",image:reportIcon,permission:"returnInquiry"},
  {name:"Customer Balance",link:"/edit-customer",image:reportIcon,permission:"customerBalance"},
  {name:"POS report",link:"/edit-customer",image:reportIcon,permission:"POSReport"},
  {name:"Salesman Detailed Listing",link:"/add-customer",image:reportIcon,permission:"salesmanDetailedListing"},
  {name:"Credit Note Listing",link:"/edit-customer",image:reportIcon,permission:"creditNoteListing"},
  {name:"Quick Inventory Check",link:"/edit-customer",image:reportIcon,permission:"quickInventoryCheck"}
]





const reportsRightItems=[
  {name:"Salesman Posting Repot",link:"/edit-customer",image:reportIcon,permission:"salesmanPostingRepot"},
  {name:"Invoice Listing",link:"/edit-customer",image:reportIcon,permission:"invoiceListing"},
  {name:"Payments",link:"/add-customer",image:reportIcon,permission:"Payments"},
]




// Reports and Inquiries Section
const setupItems=[
  {name:"Add and Manage Customers",link:"/edit-customer",image:SettingsIcon,permission:"addAndManageCustomes"},
  {name:"Customer Branches",link:"/edit-customer",image:SettingsIcon,permission:"customerBranches"},
  {name:"Sales Group",link:"/add-customer",image:SettingsIcon,permission:"salesGroup"},
  {name:"Sales Type",link:"/edit-customer",image:SettingsIcon,permission:"salesType"},
  {name:"Sales Person",link:"/edit-customer",image:SettingsIcon,permission:"salesPerson"},
  {name:"Sales Person Targets",link:"/edit-customer",image:SettingsIcon,permission:"salesPersonTargets"},
  {name:"Sales Area",link:"/edit-customer",image:SettingsIcon,permission:"salesArea"},
  {name:"Credit Status Setup",link:"/add-customer",image:SettingsIcon,permission:"creditStatusSetup"},

]


  const filteredMenu = menu.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredSubmenu = submenu.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredReportsLeftItems = reportsLeftItems.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredReportsRightItems = reportsRightItems.filter(item => permissions[item.permission as keyof Permissions]);
const filteredSetupItems = setupItems.filter(item => permissions[item.permission as keyof Permissions]);
  return (
    <div className=' bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md'>
{/* Wrapper */}
<div className='flex justify-center gap-4'>
      {/* left content */}
      <div className=' flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-96 rounded-md'>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Sales Operations</span>
      <div className='ml-2'>
      {filteredMenu.map((val,idx)=>(
        <React.Fragment key={idx}>
        <Link href={val.link}  className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="cursor-pointer font-medium text-sm">
      {val.name.includes("Point of Sale (POS)") ? (
        <>
          <span className="text-black">Point of Sale </span>
          <span className="text-[#F40000]">(POS)</span>
        </>
      ) : (
        <span className="text-[#8E530D]">{val.name}</span>
      )}
    </span>
        </Link>

       {idx===0 &&
       <div className='my-2 ml-4'>{
        filteredSubmenu.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
             <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
             <span className="cursor-pointer text-[#8e760d] font-medium text-sm">{val.name}</span>
          </Link>))}
          </div>
        }
        </React.Fragment>
      ))}
      </div>
      {error &&<p className='text-red-500'>{error}</p>}
    </div>


    {/* Right Content */}
    <div  className='flex flex-col bg-[#CACACA] w-2/4 border-[1px] border-black m-2 h-fit mb-10 rounded-md'>

    <span className=' bg-[#006E7A] px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Reports and Inquiries</span>
    <div className='ml-2'>
      
        {/* Upper Content */}
        <div className='flex gap-9'>
          <div className='flex flex-col'>
{filteredReportsLeftItems.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
             <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
             <span className="cursor-pointer text-[#249B00] font-medium text-sm">{val.name}</span>
          </Link>
        
        ))}
        </div>
        <div className='flex flex-col'>
      {filteredReportsRightItems.map((val,idx)=>(
        <Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="cursor-pointer text-[#249B00] font-medium text-sm">{val.name}</span>
     </Link>
      ))}</div>
        </div>
        
    </div>

    <span className=' bg-[#006E7A] px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Sales Setups and Company Configuration</span>
    <div className='ml-2'>
      {filteredSetupItems.map((val,idx)=>(
        <Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="cursor-pointer text-[#333333] font-medium text-sm">{val.name}</span>
     </Link>
      ))}
    </div>
    </div>

    </div>
    <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
    </div>
  );
}

export default page;
