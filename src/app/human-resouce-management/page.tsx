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
  NewPositionRequisition: boolean;
  ApproveNewPositionRequisition: boolean;
  AdvertiseJobOpening: boolean;
  AddCandidate: boolean;
  ShortlistCandidatesforInterview: boolean;
  SelectSuitedCandidate: boolean;
  Orientation: boolean;
  IssueofWorkingTools: boolean;
  LeaveApplication: boolean;
 LeaveApprovalbyHR: boolean;
 LeaveApprovalbyManagement: boolean;
 TrainingRequestbyStaff: boolean;
 PerformanceEvaluation: boolean;
 TrainingRequisitionbyHR: boolean;
 TrainingApproval: boolean;
 ConductTraining: boolean;
 PostTrainingAssessment: boolean;
 MarkEmployeeAttendance: boolean;
 ReportEmployeeforDisciplinary: boolean;
 IssueDisciplinaryWarning: boolean;
 ListWarnedEmployees: boolean;
 ListPendingDisciplinaries: boolean;
 FinalDisciplinaryHearin: boolean;
 DisciplinaryCaseClosure: boolean;
 RequestExit:Boolean;
 ReviewExitRequestandApproval: boolean;
 EmployeeExit: boolean;
 EmployeeTransferRequest: boolean;
 TransferApprovalDecline: boolean;
 EmployeePromotionRequest: boolean;
 PromotionApproval: boolean;
 DirectPromotion: boolean;

 AddPolicy: boolean;
 ListEmployees: boolean;
 AddEmployee: boolean;
 AddTrainer: boolean;
 WorkShifts: boolean;
 HolidaySettings: boolean;
 ExitReasons: boolean;
 LeaveTypes: boolean;
 DesignationTitles: boolean;
 PriorityLevels: boolean;
 ContractTypes:Boolean;
 PaymentMode: boolean;
 NonAttendanceReasons: boolean;
 EmployeeStatus:Boolean;
 Departments:Boolean;
 Rank:Boolean

 LeaveApplicationInquiry: boolean;
 StaffLeaveBalance: boolean;
 TrainingInquiry: boolean;
 EmployeePerformanceEvaluation: boolean;
 PolicyReports: boolean;
 UnsuccessfulJobApplicationInquiry: boolean;
 ShortListedCandidates: boolean;
 EmployeeRequisitionInquiry:Boolean;
 ExitRequisitionInquiry: boolean;
 DisciplinaryInquiry: boolean;
 OrientationInquiry:Boolean;
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
    {title:"New Position Requisition",link:"/human-resouce-management/new-position-requisition",permission:"NewPositionRequisition",image:StudIcon},
    {title:"Approve New Position Requisition",link:"/human-resouce-management/pos-report",permission:"ApproveNewPositionRequisition",image:StudIcon},
    {title:"Advertise Job Opening",link:"/human-resouce-management/",permission:"AdvertiseJobOpening",image:StudIcon},
  {title:"Add New Candidates",link:"/human-resouce-management/pos-report",permission:"AddCandidate",image:StudIcon},
    {title:"Shortlist Candidates for Interview",link:"/human-resouce-management/",permission:"ShortlistCandidatesforInterview",image:StudIcon},
    {title:"Select Suited Candidate",link:"/human-resouce-management/pos-report",permission:"SelectSuitedCandidate",image:StudIcon},
    {title:"Orientation Process",link:"/human-resouce-management/",permission:"Orientation",image:StudIcon},
    {title:"Issue of Working Tools",link:"/human-resouce-management/",permission:"IssueofWorkingTools",image:StudIcon},
    {title:"Leave Application Initiation",link:"/human-resouce-management/pos-report",permission:"LeaveApplication",image:StudIcon},
    {title:"Leave Approval by HR",link:"/human-resouce-management/",permission:"LeaveApprovalbyHR",image:StudIcon},
    {title:"Leave Approval by Management",link:"/human-resouce-management/pos-report",permission:"LeaveApprovalbyManagement",image:StudIcon},
    {title:"Training Request by Staff",link:"/human-resouce-management/",permission:"TrainingRequestbyStaff",image:StudIcon},
    {title:"Performance Evaluation",link:"/human-resouce-management/pos-report",permission:"PerformanceEvaluation",image:StudIcon},
    {title:"Training Requisition by HR",link:"/human-resouce-management/",permission:"TrainingRequisitionbyHR",image:StudIcon},
    {title:"Training Approval",link:"/human-resouce-management/",permission:"TrainingApproval",image:StudIcon},
    {title:"Conduct Actual Training",link:"/human-resouce-management/pos-report",permission:"ConductTraining",image:StudIcon},
      {title:"Post Training Assessment",link:"/human-resouce-management/",permission:"PostTrainingAssessment",image:StudIcon},
      {title:"Mark Employee Attendance",link:"/human-resouce-management/pos-report",permission:"MarkEmployeeAttendance",image:StudIcon},
      {title:"Report Employee for Disciplinary",link:"/human-resouce-management/",permission:" ReportEmployeeforDisciplinary",image:StudIcon},
      {title:"Issue Disciplinary Warning",link:"/human-resouce-management/",permission:"IssueDisciplinaryWarning",image:StudIcon},
     
  ]

  const rightleftmenu = [
    {title:"List Warned Employees",link:"/human-resouce-management/pos-report",permission:"ListWarnedEmployees",image:StudIcon},
    {title:"List Pending Disciplinaries",link:"/human-resouce-management/",permission:"ListPendingDisciplinaries",image:StudIcon},
    {title:"Final Disciplinary Hearing",link:"/human-resouce-management/pos-report",permission:"FinalDisciplinaryHearin",image:StudIcon},
    {title:"Disciplinary Case-Closure",link:"/human-resouce-management/",permission:"DisciplinaryCaseClosure",image:StudIcon},
    {title:"RequestExit",link:"/human-resouce-management/pos-report",permission:"RequestExit",image:StudIcon},
    {title:"ReviewExitRequestandApproval",link:"/human-resouce-management/",permission:"ReviewExitRequestandApproval",image:StudIcon},
    {title:"Employee Exit",link:"/human-resouce-management/pos-report",permission:"EmployeeExit",image:StudIcon},
    {title:"Employee Transfer Request",link:"/human-resouce-management/",permission:"EmployeeTransferRequest",image:StudIcon},
    {title:"Employee Transfer Approval Decline",link:"/human-resouce-management/pos-report",permission:"TransferApprovalDecline",image:StudIcon},
    {title:"Employee Promotion Request",link:"/human-resouce-management/",permission:"EmployeePromotionRequest",image:StudIcon},
    {title:"PromotionApproval",link:"/human-resouce-management/pos-report",permission:"PromotionApproval",image:StudIcon},
    {title:"Direct Employee Promotion",link:"/human-resouce-management/",permission:"DirectPromotion",image:StudIcon},
 

  ]

  const configuration =[
    {title:"Add Policy",link:"/human-resouce-management/policy-creation",permission:"AddPolicy",image:SettingsIcon},
    {title:"List Employees",link:"/human-resouce-management/pos-report",permission:"ListEmployees",image:SettingsIcon},
    {title:"A",link:"/human-resouce-management/",permission:"AddEmployee",image:SettingsIcon},
  {title:"Add Trainer",link:"/human-resouce-management/trainers",permission:"AddTrainer",image:SettingsIcon},
    {title:"Create Work Shifts",link:"/human-resouce-management/workshifts",permission:"WorkShifts",image:SettingsIcon},
    {title:"Holiday Settings",link:"/human-resouce-management/holiday-setup",permission:"HolidaySettings",image:SettingsIcon},
    {title:"Exit Reasons",link:"/human-resouce-management/exit-reasons",permission:"ExitReasons",image:SettingsIcon},
    {title:"Leave Types",link:"/human-resouce-management/leave-types",permission:"LeaveTypes",image:SettingsIcon},
    {title:"Designation Titles",link:"/human-resouce-management/designation-title",permission:"DesignationTitles",image:SettingsIcon},

   
    
  ]

  const leftConfiguration =[
    {title:"Contract Types",link:"/human-resouce-management/contract-types",permission:"ContractTypes",image:SettingsIcon},
    {title:"Payment Mode",link:"/human-resouce-management/paymentmethods",permission:"PaymentMode",image:SettingsIcon},
    {title:"Non Attendance Reasons",link:"/human-resouce-management/non-attendance-reasons",permission:"NonAttendanceReasons",image:SettingsIcon},
    {title:"S",link:"/human-resouce-management/pos-report",permission:"EmployeeStatus",image:SettingsIcon},
      {title:"Departments",link:"/human-resouce-management/departments",permission:"Departments",image:SettingsIcon},
          {title:"Add Rank",link:"/human-resouce-management/designation-ranks",permission:"Rank",image:SettingsIcon},
              {title:"Priority Levels",link:"/human-resouce-management/priority-levels",permission:"PriorityLevels",image:SettingsIcon},
  ]

  const reporsandInquiry =[
    {title:"Leave Application Inquiry",link:"/human-resouce-management/",permission:"LeaveApplicationInquiry",image:reportIcon},
    {title:"Staff Leave Balance",link:"/human-resouce-management/pos-report",permission:"StaffLeaveBalance",image:reportIcon},
    {title:"Training Inquiry",link:"/human-resouce-management/",permission:"TrainingInquiry",image:reportIcon},
  {title:"Employee Performance Evaluation",link:"/human-resouce-management/pos-report",permission:"EmployeePerformanceEvaluation",image:reportIcon},
    {title:"Policy Reports",link:"/human-resouce-management/",permission:"PolicyReports",image:reportIcon},
    {title:"Unsuccessful Job Application Inquiry",link:"/human-resouce-management/pos-report",permission:"UnsuccessfulJobApplicationInquiry",image:reportIcon},
    {title:"ShortListed Candidates",link:"/human-resouce-management/",permission:"ShortListedCandidates",image:reportIcon},
    {title:"Employee Requisition Inquiry",link:"/human-resouce-management/",permission:"EmployeeRequisitionInquiry",image:reportIcon},
    {title:"ExitRequisitionInquiry",link:"/human-resouce-management/pos-report",permission:"ExitRequisitionInquiry",image:reportIcon},
    {title:"Disciplinary Inquiry",link:"/human-resouce-management/",permission:"DisciplinaryInquiry",image:reportIcon},
    {title:"OrientationInquiry",link:"/human-resouce-management/pos-report",permission:"OrientationInquiry",image:reportIcon},
  ]

  const filteredLeftConfiguration = leftConfiguration.filter(item => permissions[item.permission as keyof Permissions]);                  
const filteredRightleftmenu = rightleftmenu.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredReporsandInquiry = reporsandInquiry.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredConfiguration = configuration.filter(item => permissions[item.permission as keyof Permissions]);  
  const filteredMenu = menu.filter(item => permissions[item.permission as keyof Permissions]);                  
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
      <div className=' flex flex-col bg-[#CACACA] w-2/4 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Human Resource Management Operations</span>
    <div className='ml-2 flex gap-6'>
    <div className='flex flex-col'>
      {
       filteredMenu.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.title}</span>
        </Link>))
      }
</div>
<div className='flex flex-col'>
       {
       filteredRightleftmenu.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.title}</span>
        </Link>))
      }
     </div> 
      </div>
      </div>

      {/* right content */}
      <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Human Resource Management Reports and Inquiries</span>
    <div className='ml-2'>
    {
       filteredReporsandInquiry.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
        </Link>))
      }
      </div>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Human Resource Management Setups and Company Configuration</span>
      <div className='ml-2 flex gap-16'>
      <div className='flex flex-col'>
        {
           filteredConfiguration.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
            <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
            <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.title}</span>
            </Link>))
        }
</div>
<div className='flex flex-col'>
{
           filteredLeftConfiguration.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
            <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
            <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.title}</span>
            </Link>))
        }</div>
      </div>
      </div>
    </div>
    <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
  </div>
  </Suspense>
  );
}

export default Page;
