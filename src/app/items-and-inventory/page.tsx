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
  ReceiveSupplyIntoInventory:Boolean;
  InventoryAdjustments:Boolean;
  MiscelleneousStockRequisition:Boolean;
  ApproveRequisition:Boolean;
  InventoryGRN:Boolean;
  SupplierInvoicing:Boolean;
  InventoryInvoiceAllocation:Boolean;
  InventoryConsumption:Boolean;
  StockTake:Boolean;
  ApproveStockTake:Boolean;
  InventoryDirectSales:Boolean;
  IssueStocktoBranch:Boolean;
  BranchStockApproval:Boolean;
  BranchStockTransfer:Boolean;

  InventoryStatus:Boolean;
  StoreRestockReport:Boolean;
  StockAdjustmentsReports:Boolean;
  InventoryStockRequisitionReport:Boolean;
  InventoryMisclleneousReceivalReport:Boolean;
  SupplierInvoicingReport:Boolean;
  ConsumedInventoryReport:Boolean;
  StocktakeReport:Boolean;
  InventorySaleReport:Boolean;
  StockIssueReport:Boolean;
  ApprovedIssuesReport:Boolean;
  StockTransferReport:Boolean;

  ItemCategories:Boolean;
  Items:Boolean;
  UnitofMeasure:Boolean;
  ItemType:Boolean;

  SalesPricing:Boolean;
  PurchasePricing:Boolean;
  ItemWeight:Boolean;
  Discounts:Boolean;
  ItemCommission:Boolean;
 
}
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
  
const transactions = [
  {name:"Receive Into Inventory", link:"/items-and-inventory/",image:StudIcon,permission:"ReceiveSupplyIntoInventory"},
  {name:"Inventory Adjustments", link:"/items-and-inventory/",image:StudIcon,permission:"InventoryAdjustments"},
  {name:"Miscelleneous Stock Requisition", link:"/items-and-inventory/",image:StudIcon,permission:"MiscelleneousStockRequisition"},
  {name:"Approve Requisition", link:"/items-and-inventory/",image:StudIcon,permission:"ApproveRequisition"},
  {name:"Inventory Goods Receive Note", link:"/items-and-inventory/",image:StudIcon,permission:"InventoryGRN"},
  {name:"Inventory Supplier Invoicing", link:"/items-and-inventory/",image:StudIcon,permission:"SupplierInvoicing"},
  {name:"Inventory Invoice Allocation", link:"/items-and-inventory/",image:StudIcon,permission:"InventoryInvoiceAllocation"},
  {name:"Inventory Consumption", link:"/items-and-inventory/",image:StudIcon,permission:"InventoryConsumption"},
  {name:"StockTake", link:"/items-and-inventory/",image:StudIcon,permission:"StockTake"},
  {name:"Approve StockTake", link:"/items-and-inventory/",image:StudIcon,permission:"ApproveStockTake"},
  {name:"Inventory Direct Sale", link:"/items-and-inventory/",image:StudIcon,permission:"InventoryDirectSales"},
  {name:"Issue Stock to Branch", link:"/items-and-inventory/",image:StudIcon,permission:"IssueStocktoBranch"},
  {name:"Branch Stock Approval", link:"/items-and-inventory/",image:StudIcon,permission:"BranchStockApproval"},
  {name:"Branch Stock Transfer", link:"/items-and-inventory/",image:StudIcon,permission:"BranchStockTransfer"},
]

const reportsandInquiry = [
  {name:"Inventory Status", link:"/items-and-inventory/",image:reportIcon,permission:"InventoryStatus"},
  {name:"Store Restock Report", link:"/items-and-inventory/",image:reportIcon,permission:"StoreRestockReport"},
  {name:"Stock Adjustments Report", link:"/items-and-inventory/",image:reportIcon,permission:"StockAdjustmentsReports"},
  {name:"Inventory Stock Requisition Report", link:"/items-and-inventory/",image:reportIcon,permission:"InventoryStockRequisitionReport"},
  {name:"Inventory Miscelleneous Receivals Report", link:"/items-and-inventory/",image:reportIcon,permission:"InventoryMisclleneousReceivalReport"},
  {name:"Supplier Invoicing Report", link:"/items-and-inventory/",image:reportIcon,permission:"SupplierInvoicingReport"},
  {name:"Consumed Inventory Report", link:"/items-and-inventory/",image:reportIcon,permission:"ConsumedInventoryReport"},
  {name:"StockTake Reports", link:"/items-and-inventory/",image:reportIcon,permission:"StocktakeReport"},
  {name:"Inventory Sale Report", link:"/items-and-inventory/",image:reportIcon,permission:"InventorySaleReport"},
  {name:"Stock Issue Report", link:"/items-and-inventory/",image:reportIcon,permission:"StockIssueReport"},
  {name:"Approved Issue Report", link:"/items-and-inventory/",image:reportIcon,permission:"ApprovedIssuesReport"},
  {name:"Stock Transfer Report", link:"/items-and-inventory/",image:reportIcon,permission:"StockTransferReport"},
  
]

const mainainance = [
  {name:"Items Categories", link:"/items-and-inventory/",image:SettingsIcon,permission:"ItemCategories"},
  {name:"Items", link:"/items-and-inventory/",image:SettingsIcon,permission:"Items"},
  {name:"Units of Measure", link:"/items-and-inventory/",image:SettingsIcon,permission:"UnitofMeasure"},
  {name:"Item Type", link:"/items-and-inventory/",image:SettingsIcon,permission:"ItemType"},
  
]

const pricingandCost = [
  {name:"Sales Pricing", link:"/items-and-inventory/",image:SettingsIcon,permission:"SalesPricing"},
  {name:"Purchase Pricing", link:"/items-and-inventory/",image:SettingsIcon,permission:"PurchasePricing"},
  {name:"Item Commission", link:"/items-and-inventory/",image:SettingsIcon,permission:"ItemCommission"},
  {name:"Item Weight", link:"/items-and-inventory/",image:SettingsIcon,permission:"ItemWeight"},
  {name:"Discounts", link:"/items-and-inventory/",image:SettingsIcon,permission:"Discounts"},
  
]


const filteredPricingandCost = pricingandCost.filter(item => permissions[item.permission as keyof Permissions]);
const filteredMainainance = mainainance.filter(item => permissions[item.permission as keyof Permissions]);
const filteredReportsandInquiry = reportsandInquiry.filter(item => permissions[item.permission as keyof Permissions]);
const filteredTransactions = transactions.filter(item => permissions[item.permission as keyof Permissions]);
  return (
    <div className=' bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md'>
    {/* wrapper */}
    <div className='flex justify-center gap-4'>
      {/* left content */}
      <div className=' flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Operations</span>
    <div className='ml-2'>
      {
       filteredTransactions.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.name}</span>
        </Link>))
      }
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Setups and Company Configuration</span>
      <div className='ml-2'>
        {
           filteredPricingandCost.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
            <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
            <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
            </Link>))
        }
      </div>
      </div>
      </div>

      {/* right content */}
      <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Reports and Inquiries</span>
    <div className='ml-2'>
    {
       filteredReportsandInquiry.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.name}</span>
        </Link>))
      }
      </div>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Setups and Company Configuration</span>
      <div className='ml-2'>
        {
           filteredMainainance.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
            <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
            <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
            </Link>))
        }
      </div>
      </div>
    </div>
    <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
  </div>
  );
}

export default page;
