"use client"
import { useEffect } from 'react';
import { usePermissionStore } from '@/store/usePermissionStore';
import Link from 'next/link';
import StudIcon from "@/assets/LinkBar.svg"
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'
import Image from 'next/image';
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

  if (loading) return <p>Loading...</p>;
  if (!permissions) return <p>Unauthorized</p>;

  const menu =[
    {title:"New Position Requisition",link:"/procurement/",permission:"NewPositionRequisition",image:StudIcon},
    {title:"Approve New Position Requisition",link:"/sales/pos-report",permission:"ApproveNewPositionRequisition",image:StudIcon},
    {title:"Advertise Job Opening",link:"/procurement/",permission:"AdvertiseJobOpening",image:StudIcon},
  {title:"Add New Candidates",link:"/sales/pos-report",permission:"AddCandidate",image:StudIcon},
    {title:"Shortlist Candidates for Interview",link:"/procurement/",permission:"ShortlistCandidatesforInterview",image:StudIcon},
    {title:"Select Suited Candidate",link:"/sales/pos-report",permission:"SelectSuitedCandidate",image:StudIcon},
    {title:"Orientation Process",link:"/procurement/",permission:"Orientation",image:StudIcon},
    {title:"Issue of Working Tools",link:"/procurement/",permission:"IssueofWorkingTools",image:StudIcon},
    {title:"Leave Application Initiation",link:"/sales/pos-report",permission:"LeaveApplication",image:StudIcon},
    {title:"Leave Approval by HR",link:"/procurement/",permission:"LeaveApprovalbyHR",image:StudIcon},
    {title:"Leave Approval by Management",link:"/sales/pos-report",permission:"LeaveApprovalbyManagement",image:StudIcon},
    {title:"Training Request by Staff",link:"/procurement/",permission:"TrainingRequestbyStaff",image:StudIcon},
    {title:"Performance Evaluation",link:"/sales/pos-report",permission:"PerformanceEvaluation",image:StudIcon},
    {title:"Training Requisition by HR",link:"/procurement/",permission:"TrainingRequisitionbyHR",image:StudIcon},
    {title:"Training Approval",link:"/procurement/",permission:"TrainingApproval",image:StudIcon},
    {title:"Conduct Actual Training",link:"/sales/pos-report",permission:"ConductTraining",image:StudIcon},
      {title:"Post Training Assessment",link:"/procurement/",permission:"PostTrainingAssessment",image:StudIcon},
      {title:"Mark Employee Attendance",link:"/sales/pos-report",permission:"MarkEmployeeAttendance",image:StudIcon},
      {title:"Report Employee for Disciplinary",link:"/procurement/",permission:" ReportEmployeeforDisciplinary",image:StudIcon},
      {title:"Issue Disciplinary Warning",link:"/procurement/",permission:"IssueDisciplinaryWarning",image:StudIcon},
      {title:"List Warned Employees",link:"/sales/pos-report",permission:"ListWarnedEmployees",image:StudIcon},
      {title:"List Pending Disciplinaries",link:"/procurement/",permission:"ListPendingDisciplinaries",image:StudIcon},
      {title:"Final Disciplinary Hearing",link:"/sales/pos-report",permission:"FinalDisciplinaryHearin",image:StudIcon},
      {title:"Disciplinary Case-Closure",link:"/procurement/",permission:"DisciplinaryCaseClosure",image:StudIcon},
      {title:"RequestExit",link:"/sales/pos-report",permission:"RequestExit",image:StudIcon},
      {title:"ReviewExitRequestandApproval",link:"/procurement/",permission:"ReviewExitRequestandApproval",image:StudIcon},
      {title:"Employee Exit",link:"/sales/pos-report",permission:"EmployeeExit",image:StudIcon},
      {title:"Employee Transfer Request",link:"/procurement/",permission:"EmployeeTransferRequest",image:StudIcon},
      {title:"Employee Transfer Approval Decline",link:"/sales/pos-report",permission:"TransferApprovalDecline",image:StudIcon},
      {title:"Employee Promotion Request",link:"/procurement/",permission:"EmployeePromotionRequest",image:StudIcon},
      {title:"PromotionApproval",link:"/sales/pos-report",permission:"PromotionApproval",image:StudIcon},
      {title:"Direct Employee Promotion",link:"/procurement/",permission:"DirectPromotion",image:StudIcon},
   

  ]

  const configuration =[
    {title:"Add Policy",link:"/procurement/",permission:"AddPolicy",image:SettingsIcon},
    {title:"List Employees",link:"/sales/pos-report",permission:"ListEmployees",image:SettingsIcon},
    {title:"Add Employee",link:"/procurement/",permission:"AddEmployee",image:SettingsIcon},
  {title:"Add Trainer",link:"/sales/pos-report",permission:"AddTrainer",image:SettingsIcon},
    {title:"Create Work Shifts",link:"/procurement/",permission:"WorkShifts",image:SettingsIcon},
    {title:"Holiday Settings",link:"/sales/pos-report",permission:"HolidaySettings",image:SettingsIcon},
    {title:"Exit Reasons",link:"/procurement/",permission:"ExitReasons",image:SettingsIcon},
    {title:"Leave Types",link:"/procurement/",permission:"LeaveTypes",image:SettingsIcon},
    {title:"Designation Titles",link:"/sales/pos-report",permission:"DesignationTitles",image:SettingsIcon},
    {title:"Priority Levels",link:"/procurement/",permission:"PriorityLevels",image:SettingsIcon},
    {title:"Contract Types",link:"/sales/pos-report",permission:"ContractTypes",image:SettingsIcon},
    {title:"Payment Mode",link:"/procurement/",permission:"PaymentMode",image:SettingsIcon},
    {title:"Non Attendance Reasons",link:"/sales/pos-report",permission:"NonAttendanceReasons",image:SettingsIcon},
    {title:"Set Employee Status",link:"/sales/pos-report",permission:"EmployeeStatus",image:SettingsIcon},
  ]

  const reporsandInquiry =[
    {title:"Leave Application Inquiry",link:"/procurement/",permission:"LeaveApplicationInquiry",image:reportIcon},
    {title:"Staff Leave Balance",link:"/sales/pos-report",permission:"StaffLeaveBalance",image:reportIcon},
    {title:"Training Inquiry",link:"/procurement/",permission:"TrainingInquiry",image:reportIcon},
  {title:"Employee Performance Evaluation",link:"/sales/pos-report",permission:"EmployeePerformanceEvaluation",image:reportIcon},
    {title:"Policy Reports",link:"/procurement/",permission:"PolicyReports",image:reportIcon},
    {title:"Unsuccessful Job Application Inquiry",link:"/sales/pos-report",permission:"UnsuccessfulJobApplicationInquiry",image:reportIcon},
    {title:"ShortListed Candidates",link:"/procurement/",permission:"ShortListedCandidates",image:reportIcon},
    {title:"Employee Requisition Inquiry",link:"/procurement/",permission:"EmployeeRequisitionInquiry",image:reportIcon},
    {title:"ExitRequisitionInquiry",link:"/sales/pos-report",permission:"ExitRequisitionInquiry",image:reportIcon},
    {title:"Disciplinary Inquiry",link:"/procurement/",permission:"DisciplinaryInquiry",image:reportIcon},
    {title:"OrientationInquiry",link:"/sales/pos-report",permission:"OrientationInquiry",image:reportIcon},
  ]

  const filteredReporsandInquiry = reporsandInquiry.filter(item => permissions[item.permission as keyof Permissions]);
  const filteredConfiguration = configuration.filter(item => permissions[item.permission as keyof Permissions]);  
  const filteredMenu = menu.filter(item => permissions[item.permission as keyof Permissions]);                  
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
      <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Reports and Inquiries</span>
    <div className='ml-2'>
    {
       filteredReporsandInquiry.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.title}</span>
        </Link>))
      }
      </div>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Setups and Company Configuration</span>
      <div className='ml-2'>
        {
           filteredConfiguration.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
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
}

export default Page;
