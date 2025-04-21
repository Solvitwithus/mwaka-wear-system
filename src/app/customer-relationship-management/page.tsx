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
  SalesDashboard: boolean;
  CustomerAnalysis: boolean;
  CustomerTransactionView: boolean;
  CustomerListing: boolean;
  CustomerRemarks: boolean;
  DisqualifiedLeads: boolean;
  Appointment: boolean;
  AddandManageLeads: boolean;
  SalesArea: boolean;
  SalesGroups: boolean;
  
};
const Page = () => {
  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading) return <p>Loading...</p>;
  if (!permissions) return <p>Unauthorized</p>;

  const menu =[
    {title:"Sales Dashboard",link:"/procurement/",permission:"SalesDashboard",image:StudIcon},
    {title:"Customer Analysis",link:"/sales/pos-report",permission:"CustomerAnalysis",image:StudIcon},
   

  ]

  const report =[
    {title:"Customer Transaction View",link:"/procurement/",permission:"CustomerTransactionView",image:reportIcon},
    {title:"Customer Listing",link:"/sales/pos-report",permission:"CustomerListing",image:reportIcon},
    {title:"Customer Remarks",link:"/procurement/",permission:"CustomerRemarks",image:reportIcon},
  {title:"Disqualified Leads",link:"/sales/pos-report",permission:"DisqualifiedLeads",image:reportIcon},
    {title:"Appointments",link:"/procurement/",permission:"Appointments",image:reportIcon},
  ]

  const settings = [
    {title:"Add and Manage Leads",link:"/procurement/",permission:"AddandManageLeads",image:SettingsIcon},
    {title:"Sales Area",link:"/procurement/",permission:"SalesArea",image:SettingsIcon},
  {title:"Sales roups",link:"/procurement/",permission:"SalesGroups",image:SettingsIcon},

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
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Customer Relationship Management Operations</span>
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
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Customer Relationship Management Reports and Inquiries</span>
      <div className='ml-2'>
      {
         filteredReports.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
          </Link>))
        }
        </div>
        <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Customer Relationship Management Setups and Company Configuration</span>
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
