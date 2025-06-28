"use client"
import { Suspense, useEffect } from 'react';
import { usePermissionStore } from '@/store/usePermissionStore';
import Link from 'next/link';
import StudIcon from "@/assets/LinkBar.svg"
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'
import Image from 'next/image';
import { Skeleton } from '@heroui/skeleton';
type Permissions={
  MonthlyPosting:Boolean;
  RecurrentPosting:Boolean;
  ApprovePayroll:Boolean;
  ProcessPayroll:Boolean;
  DeductionRegistration:Boolean;
  EarningorDeductionApproval:Boolean;
  SendPayslip:Boolean;
  StaffAbsentismReview:Boolean;
  PayslipsReport:Boolean;
  MonthlyPostingReport:Boolean;
  RecurrentPostingReview:Boolean;
  DeductionsInquiry:Boolean;
  AddBank:Boolean;
  DeductionOrganizations:Boolean;
  Earnings:Boolean;
  Deductions:Boolean;
  TaxNSSFNHIFHLandReliefSetup:Boolean;
  PayrollandGeneralLedger:Boolean;
}
const Page = () => {
  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

if (loading) return (
  <div className="p-4">
    <div className="w-[100%] opacity-20 space-y-5 p-4 rounded-lg border border-gray-300 shadow-md bg-white">
      <Skeleton className="rounded-lg h-24 bg-gray-300" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-2/5 rounded-lg bg-gray-300" />
      </div>
    </div>
  </div>
);
  if (!permissions)  return (
  <div className="p-4">
    <div className="w-[100%] opacity-20 space-y-5 p-4 rounded-lg border border-gray-300 shadow-md bg-white">
      <Skeleton className="rounded-lg h-24 bg-gray-300" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-2/5 rounded-lg bg-gray-300" />
      </div>
    </div>
  </div>)

  const menu =[
    {title:"Monthly Postings",link:"/procurement/",permission:"MonthlyPosting",image:StudIcon},
    {title:"Recurrent Posting",link:"/sales/pos-report",permission:"RecurrentPosting",image:StudIcon},
    {title:"Approve Payroll",link:"/procurement/",permission:"ApprovePayroll",image:StudIcon},
  {title:"Process Payroll",link:"/sales/pos-report",permission:"ProcessPayroll",image:StudIcon},
    {title:"Deduction Registration",link:"/procurement/",permission:"DeductionRegistration",image:StudIcon},
    {title:"Earning or Deduction Approval",link:"/sales/pos-report",permission:"EarningorDeductionApproval",image:StudIcon},
    {title:"Send Payslip",link:"/procurement/",permission:"SendPayslip",image:StudIcon},
    

  ]

  const report =[
    {title:"Staff Absentism Review",link:"/procurement/",permission:"StaffAbsentismReview",image:reportIcon},
    {title:"Payslips Report",link:"/sales/pos-report",permission:"PayslipsReport",image:reportIcon},
    {title:"Monthly Postings Report",link:"/procurement/",permission:"MonthlyPostingReport",image:reportIcon},
  {title:"Recurrent Posting Review",link:"/sales/pos-report",permission:"RecurrentPostingReview",image:reportIcon},
    {title:"Deductions Inquiry",link:"/sales/pos-report",permission:"DeductionsInquiry",image:reportIcon},
   
  ]

  const settings = [
    {title:"Add Bank",link:"/procurement/",permission:"AddBank",image:SettingsIcon},
    {title:"Deduction Organizations",link:"/procurement/",permission:"DeductionOrganizations",image:SettingsIcon},
    {title:"Earnings",link:"/procurement/",permission:"Earnings",image:SettingsIcon},
    {title:"Deductions",link:"/procurement/",permission:"Deductions",image:SettingsIcon},
    {title:"Tax & NSSF & NHIF & HL and Relief Setup",link:"/payroll/general",permission:"TaxNSSFNHIFHLandReliefSetup",image:SettingsIcon},
    {title:"Payroll and General Ledger (GL)",link:"/procurement/",permission:"PayrollandGeneralLedger",image:SettingsIcon},
    {title:"Add Bank",link:"/procurement/",permission:"AddBank",image:SettingsIcon},
  ]
  const filteredMenu = menu.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredReports = report.filter(itm => permissions[itm.permission as keyof Permissions])
  const filteredSettings = settings.filter(itm => permissions[itm.permission as keyof Permissions])
  return (
          <Suspense fallback={<div className="p-4">
                <div className="w-[100%] opacity-20 space-y-5 p-4 rounded-lg border border-gray-300 shadow-md bg-white">
                  <Skeleton className="rounded-lg h-24 bg-gray-300" />
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
                    <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
                    <Skeleton className="h-3 w-2/5 rounded-lg bg-gray-300" />
                  </div>
                </div>
              </div>}>
    <div className=' bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md'>
      {/* wrapper */}
      <div className='flex justify-center gap-4'>
        {/* left content */}
        <div className=' flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md'>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Payroll Operations</span>
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
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Payroll Reports and Inquiries</span>
      <div className='ml-2'>
      {
         filteredReports.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
          </Link>))
        }
        </div>
        <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Payroll Setups and Company Configuration</span>
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
    </Suspense>
  );
};

export default Page;
