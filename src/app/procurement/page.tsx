// app/sales/page.tsx or wherever you're using it
"use client"
import { useEffect } from 'react';
import { usePermissionStore } from '@/store/usePermissionStore';
import Link from 'next/link';
import StudIcon from "@/assets/LinkBar.svg"
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'
import Image from 'next/image';
type Permissions = {
  requisitionEntry: boolean;
  requisitionReview: boolean;
  requisitionApproval: boolean;
  POAgainstPurchaseRequisition: boolean;
  directPOEntry: boolean;
  outstandingPOMaintainance: boolean;
  DirectGRN: boolean;
  GRN: boolean;
  supplierInvoice: boolean;
  allocatePayments: boolean;
  addCreditNote: boolean;
  allocateCredit: boolean;
  fowardToStorage: boolean;
  supplierRating: boolean;

  POReport: boolean;
  supplierTransactionInquiry: boolean;
  supplierInvoicingAllocationReport: boolean;
  supplierCeditAllocationReport: boolean;
  directPurchaseOrdersReport: boolean;
  supplierRatingReport: boolean;
  purchaseModuleDashboard: boolean;
  Fowardedstockstostore: boolean;
  supplierReports: boolean;
  GRNReports: boolean;
  addorEditSuppliers:Boolean;
};
const Page = () => {
  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading) return <p>Loading...</p>;
  if (!permissions) return <p>Unauthorized</p>;

  const menu =[
    {title:"Purchase Requisition Entry",link:"/procurement/",permission:"requisitionEntry",image:StudIcon},
    {title:"Purchase Requisition Review",link:"/sales/pos-report",permission:"requisitionReview",image:StudIcon},
    {title:"Purchase Requisition Approval",link:"/procurement/",permission:"requisitionApproval",image:StudIcon},
  {title:"Purchase Order Against Purchase Requisition",link:"/sales/pos-report",permission:"POAgainstPurchaseRequisition",image:StudIcon},
    {title:"Purchase Order Entry (Direct)",link:"/procurement/",permission:"directPOEntry",image:StudIcon},
    {title:"Outstanding Purchase Order Maintainance",link:"/sales/pos-report",permission:"outstandingPOMaintainance",image:StudIcon},
    {title:"Goods Receive Note (GRN) (Direct)",link:"/procurement/",permission:"DirectGRN",image:StudIcon},
    {title:"Goods Receive Note (GRN)",link:"/procurement/",permission:"GRN",image:StudIcon},
    {title:"Supplier Invoice",link:"/sales/pos-report",permission:"supplierInvoice",image:StudIcon},
    {title:"Invoice Payment Allocation",link:"/procurement/",permission:"allocatePayments",image:StudIcon},
    {title:"Add Credit Note",link:"/sales/pos-report",permission:"addCreditNote",image:StudIcon},
    {title:"Allocate Credit",link:"/procurement/",permission:"allocateCredit",image:StudIcon},
    {title:"Foward to Storage",link:"/sales/pos-report",permission:"fowardToStorage",image:StudIcon},
    {title:"Supplier Rating",link:"/procurement/",permission:"supplierRating",image:StudIcon},
   

  ]

  const report =[
    {title:"Purchase Order Inquiry",link:"/procurement/",permission:"POReport",image:reportIcon},
    {title:"Supplier Transaction Inquiry",link:"/sales/pos-report",permission:"supplierTransactionInquiry",image:reportIcon},
    {title:"Supplier Invoicing Allocation",link:"/procurement/",permission:"supplierInvoicingAllocationReport",image:reportIcon},
  {title:"Supplier Credit Allocation",link:"/sales/pos-report",permission:"supplierCeditAllocationReport",image:reportIcon},
    {title:"Direct Orders",link:"/sales/pos-report",permission:"directPurchaseOrdersReport",image:reportIcon},
    {title:"Rating Report",link:"/procurement/",permission:"supplierRatingReport",image:reportIcon},
    {title:"Purchase Dashboard",link:"/procurement/",permission:"purchaseModuleDashboard",image:reportIcon},
    {title:"Goods Receive Note Report",link:"/sales/pos-report",permission:"GRNReports",image:reportIcon},
    {title:"Supplier Reports",link:"/procurement/",permission:"supplierReports",image:reportIcon},
    {title:"Fowarded Stocks to Store",link:"/sales/pos-report",permission:"Fowardedstockstostore",image:reportIcon},
  ]

  const settings = [
    {title:"Add Supplier",link:"/procurement/",permission:"addorEditSuppliers",image:SettingsIcon},
  ]
  const filteredMenu = menu.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredReports = report.filter(itm => permissions[itm.permission as keyof Permissions])
  const filteredSettings = settings.filter(itm => permissions[itm.permission as keyof Permissions])
  return (
    <div className=' bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md'>
      {/* wrapper */}
      <div className='flex justify-center gap-4'>
        {/* left content */}
        <div className=' flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md'>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Operations</span>
      <div className='ml-2'>
        {
         filteredMenu.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.title}</span>
          </Link>))
        }
        </div>
        </div>

        {/* right content */}
        <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-96 rounded-md'>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Reports and Inquiries</span>
      <div className='ml-2'>
      {
         filteredReports.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
          </Link>))
        }
        </div>
        <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Setups and Company Configuration</span>
        <div className='ml-2'>
          {
             filteredSettings.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
              <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
              <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.title}</span>
              </Link>))
          }
        </div>
        </div>
      </div>
      <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
    </div>
  );
};

export default Page;
