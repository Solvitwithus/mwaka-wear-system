
"use client"
import { Suspense, useEffect } from 'react';
import { usePermissionStore } from '@/store/usePermissionStore';
import Link from 'next/link';
import StudIcon from "@/assets/LinkBar.svg"
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'
import Image from 'next/image';
import { Skeleton } from '@heroui/skeleton';
type Permissions = {
  SuperPayments: boolean;
  Deposits: boolean;
  BankTransfers: boolean;
  ApprovePayments: boolean;
  BudgetEntry: boolean;
  BudgetEvaluation: boolean;
  BudgetApproval: boolean;
  JournalEntry: boolean;
  ReconcileBankAccounts: boolean;
  ApproveJournalEntry: boolean;
  RequisitiontoAddtoPettyCashBook: boolean;
  PettyCashBookRequisitionReview: boolean;
  ApprovePettyCashBookRequisition: boolean;
  BalanceBooks: boolean;
 PettyCashBookReport: boolean;
  JournalInquiry: boolean;
  BankAccountInquiry: boolean;
  TaxInquiry: boolean;
  BudgetInquiry: boolean;
  BalanceSheet: boolean;
  BankReports: boolean;
  GeneralLedgersReports: boolean;
 MpesaTill: boolean;
  BankAccounts: boolean;
  Banks:Boolean;
  Currencies: boolean;
  PaymentMethods: boolean;
  PaymentTerms:boolean;
  ExchangeRates:Boolean;
  GLAccounts: boolean;
  GLAccountsGroups: boolean;
  BudgetPeriods:Boolean;
};
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
    {title:"Super Payments",link:"/procurement/",permission:"SuperPayments",image:StudIcon},
    {title:"Make  Deposits",link:"/sales/pos-report",permission:"Deposits",image:StudIcon},
    {title:"Bank Transfers",link:"/procurement/",permission:"BankTransfers",image:StudIcon},
  {title:"ApprovePayments:",link:"/sales/pos-report",permission:"ApprovePayments:",image:StudIcon},
    {title:"Budget Entry",link:"/procurement/",permission:"BudgetEntry",image:StudIcon},
    {title:"Budget Evaluation",link:"/sales/pos-report",permission:"BudgetEvaluation",image:StudIcon},
    {title:"Budget Approval",link:"/procurement/",permission:"BudgetApproval",image:StudIcon},
    {title:"Journal Entry",link:"/procurement/",permission:"JournalEntry",image:StudIcon},
    {title:"Reconcile Bank Accounts",link:"/sales/pos-report",permission:"ReconcileBankAccounts",image:StudIcon},
    {title:"Approve Journal Entry",link:"/procurement/",permission:"ApproveJournalEntry",image:StudIcon},
    {title:"Requisition to Add to Petty CashBook",link:"/sales/pos-report",permission:"RequisitiontoAddtoPettyCashBook",image:StudIcon},
    {title:"Petty CashBook Requisition Review",link:"/procurement/",permission:"PettyCashBookRequisitionReview",image:StudIcon},
    {title:"Approve Petty CashBook Requisition",link:"/sales/pos-report",permission:"ApprovePettyCashBookRequisition",image:StudIcon},
    {title:"BalanceBooks",link:"/procurement/",permission:"BalanceBooks",image:StudIcon},
   

  ]

  const report =[
    {title:"Petty CashBook Report",link:"/procurement/",permission:"PettyCashBookReport",image:reportIcon},
    {title:"Journal Inquiry",link:"/sales/pos-report",permission:"JournalInquiry",image:reportIcon},
    {title:"Bank Account Inquiry",link:"/procurement/",permission:"BankAccountInquiry",image:reportIcon},
  {title:"Tax Inquiry",link:"/sales/pos-report",permission:"TaxInquiry",image:reportIcon},
    {title:"Budget Inquiry",link:"/sales/pos-report",permission:"BudgetInquiry",image:reportIcon},
    {title:"Balance Sheet",link:"/procurement/",permission:"BalanceSheet",image:reportIcon},
    {title:"Bank Reports",link:"/procurement/",permission:"BankReports",image:reportIcon},
    {title:"General Ledgers Reports",link:"/sales/pos-report",permission:"GeneralLedgersReports",image:reportIcon},
   
  ]

  const settings = [
    {title:"Mpesa Till",link:"/procurement/",permission:"MpesaTill",image:SettingsIcon},
    {title:"Bank Accounts",link:"/finance/create-account",permission:"BankAccounts",image:reportIcon},
    {title:"Add Banks",link:"/finance/createbank",permission:"Banks",image:reportIcon},
    {title:"Currencies",link:"/finance/currencymanagement",permission:"Currencies",image:SettingsIcon},
    {title:"Payment Methods",link:"/finance/paymentmethods",permission:"PaymentMethods",image:reportIcon},
      {title:"Payment Terms",link:"/finance/paymentterms",permission:"PaymentTerms",image:reportIcon},
    {title:"Exchange Rates",link:"/sales/pos-report",permission:"ExchangeRates",image:reportIcon},
    {title:"General Ledgers GL Accounts",link:"/procurement/",permission:"GLAccounts",image:SettingsIcon},
    {title:"Genaral Ledgers GL Accounts Groups",link:"/procurement/",permission:"GLAccountsGroups",image:reportIcon},
    {title:"Budget Periods",link:"/sales/pos-report",permission:"BudgetPeriods",image:reportIcon},
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
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Finance Operations</span>
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
        <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md'>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Finance Reports and Inquiries</span>
      <div className='ml-2'>
      {
         filteredReports.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
          <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
          <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
          </Link>))
        }
        </div>
        <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Finance Setups and Company Configuration</span>
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
