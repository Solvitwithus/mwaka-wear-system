"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { ChangeEvent, FormEvent, useState } from 'react'
interface Roles {
  name: string;
  description: string;
  permissions: { name: string; value: boolean }[];
}


const procurementPermissions =[
  {name:"requisitionEntry",value:false},
  {name:"requisitionReview",value:false},
  {name:"requisitionApproval",value:false},
  {name:"POAgainstPurchaseRequisition",value:false},
  {name:"directPOEntry",value:false},
  {name:"outstandingPOMaintainance",value:false},
  {name:"DirectGRN",value:false},
  {name:"GRN",value:false},
  {name:"supplierInvoice",value:false},
  {name:"allocatePayments",value:false},
  {name:"addCreditNote",value:false},
  {name:"allocateCredit",value:false},
  {name:"fowardToStorage",value:false},
  {name:"supplierRating",value:false},

  {name:"POReport",value:false},
  {name:"supplierTransactionInquiry",value:false},
  {name:"supplierInvoicingAllocationReport",value:false},
  {name:"supplierCeditAllocationReport",value:false},
  {name:"directPurchaseOrdersReport",value:false},
  {name:"supplierRatingReport",value:false},
  {name:"purchaseModuleDashboard",value:false},
  {name:"GRNReports",value:false},
  {name:"supplierReports",value:false},
  {name:"Fowardedstockstostore",value:false},

  {name:"addorEditSuppliers",value:false},
]


const SalesPermissions = [
  {name:"PointOfSale",value:false},
  {name:"printStatement",value:false},
  {name:"directSale",value:false},
  {name:"customerPostings",value:false},
  {name:"salesManPosting",value:false},
  {name:"customerCredit",value:false},
  {name:"customerCreditPayments",value:false},
  {name:"salesQuotationEntry",value:false},
  {name:"salesOrderEntry",value:false},
  {name:"deliveryAgainstSalesOrders",value:false},
  {name:"invoiceAgainstSalesDelivery",value:false},
  {name:"invoivePrepaidOrders",value:false},


  {name:"salesDashboard",value:false},
  {name:"salesQuotationInquiry",value:false},
  {name:"salesOrderInquiry",value:false},
  {name:"customerTransactions",value:false},
  {name:"returnInquiry",value:false},
  {name:"customerBalance",value:false},
  {name:"POSReport",value:false},
  {name:"salesmanDetailedListing",value:false},
  {name:"creditNoteListing",value:false},
  {name:"quickInventoryCheck",value:false},

  {name:"salesmanPostingRepot",value:false},
  {name:"invoiceListing",value:false},
  {name:"Payments",value:false},

  {name:"addAndManageCustomes",value:false},
  {name:"customerBranches",value:false},
  {name:"salesGroup",value:false},
  {name:"salesType",value:false},
  {name:"salesPerson",value:false},

  {name:"salesPersonTargets",value:false},
  {name:"salesArea",value:false},
  {name:"creditStatusSetup",value:false},
]


const itemsAndInventoryPemissions =[
  {name:"ReceiveSupplyIntoInventory",value:false},
  {name:"InventoryAdjustments",value:false},
  {name:"MiscelleneousStockRequisition",value:false},
  {name:"ApproveRequisition",value:false},
  {name:"InventoryGRN",value:false},
  {name:"SupplierInvoicing",value:false},
  {name:"InventoryInvoiceAllocation",value:false},
  {name:"InventoryConsumption",value:false},
  {name:"StockTake",value:false},
  {name:"ApproveStockTake",value:false},
  {name:"InventoryDirectSales",value:false},
  {name:"IssueStocktoBranch",value:false},
  {name:"BranchStockApproval",value:false},
  {name:"BranchStockTransfer",value:false},
  {name:"InventoryStatus",value:false},
  {name:"StoreRestockReport",value:false},
  {name:"StockAdjustmentsReports",value:false},
  {name:"InventoryStockRequisitionReport",value:false},
  {name:"InventoryMisclleneousReceivalReport",value:false},
  {name:"SupplierInvoicingReport",value:false},
  {name:"ConsumedInventoryReport",value:false},
  {name:"StocktakeReport",value:false},
  {name:"InventorySaleReport",value:false},
  {name:"StockIssueReport",value:false},
  {name:"ApprovedIssuesReport",value:false},
  {name:"StockTransferReport",value:false},
  {name:"ItemCategories",value:false},
  {name:"Items",value:false},
  {name:"UnitofMeasure",value:false},
  {name:"ItemType",value:false},
  {name:"SalesPricing",value:false},
  {name:"PurchasePricing",value:false},
  {name:"ItemWeight",value:false},
  {name:"Discounts",value:false},
  {name:"ItemCommission",value:false},
]


const humanResourceManagement =[
  {name:"NewPositionRequisition",value:false},
  {name:"ApproveNewPositionRequisition",value:false},
  {name:"AdvertiseJobOpening",value:false},
  {name:"AddCandidate",value:false},
  {name:"ShortlistCandidatesforInterview",value:false},
  {name:"SelectSuitedCandidate",value:false},
  {name:"Orientation",value:false},
  {name:"IssueofWorkingTools",value:false},
  {name:"LeaveApplication",value:false},
  {name:"LeaveApprovalbyHR",value:false},
  {name:"LeaveApprovalbyManagement",value:false},
  {name:"TrainingRequestbyStaff",value:false},
  {name:"PerformanceEvaluation",value:false},
  {name:"TrainingRequisitionbyHR",value:false},
  {name:"TrainingApproval",value:false},
  {name:"ConductTraining",value:false},
  {name:"PostTrainingAssessment",value:false},
  {name:"MarkEmployeeAttendance",value:false},
  {name:"ReportEmployeeforDisciplinary",value:false},
  {name:"IssueDisciplinaryWarning",value:false},
  {name:"ListWarnedEmployees",value:false},
  {name:"ListPendingDisciplinaries",value:false},
  {name:"FinalDisciplinaryHearing",value:false},
  {name:"DisciplinaryCaseClosure",value:false},
  {name:"RequestExit",value:false},
  {name:"ReviewExitRequestandApproval",value:false},
  {name:"EmployeeExit",value:false},
  {name:"EmployeeTransferRequest",value:false},
  {name:"TransferApprovalDecline",value:false},
  {name:"EmployeePromotionRequest",value:false},
  {name:"PromotionApproval",value:false},
  {name:"DirectPromotion",value:false},

  {name:"AddPolicy",value:false},
  {name:"ListEmployees",value:false},
  {name:"AddEmployee",value:false},
  {name:"AddTrainer",value:false},
  {name:"WorkShifts",value:false},
  {name:"HolidaySettings",value:false},
  {name:"ExitReasons",value:false},
  {name:"LeaveTypes",value:false},
  {name:"DesignationTitles",value:false},
  {name:"PriorityLevels",value:false},
  {name:"ContractTypes",value:false},
  {name:"PaymentMode",value:false},
  {name:"NonAttendanceReasons",value:false},
  {name:"EmployeeStatus",value:false},

  {name:"LeaveApplicationInquiry",value:false},
  {name:"StaffLeaveBalance",value:false},
  {name:"TrainingInquiry",value:false},
  {name:"EmployeePerformanceEvaluation",value:false},
  {name:"PolicyReports",value:false},
  {name:"UnsuccessfulJobApplicationInquiry",value:false},
  {name:"ShortListedCandidates",value:false},
  {name:"EmployeeRequisitionInquiry",value:false},
  {name:"ExitRequisitionInquiry",value:false},
  {name:"DisciplinaryInquiry",value:false},
  {name:"OrientationInquiry",value:false},                
]


const transport =[
  {name:"CreateLoadingOrder",value:false},
  {name:"VehicleLoading",value:false},
  {name:"VehiclePurchaseOrderEntry",value:false},
  {name:"VehiclePurchaseApproval",value:false},
  {name:"VehiclePayment",value:false},
  {name:"VehicleConsumption",value:false},
  {name:"ExpenseInvoice",value:false},
  {name:"LifecycleTracking",value:false}, 
  {name:"AddVehicle",value:false},
  {name:"CreateVehicleShift",value:false},
  {name:"VehicleCategories",value:false},
  {name:"VehicleGenealLedgerAccount",value:false},
  {name:"VehicleExpenseCategories",value:false}, 
  {name:"DriverListing",value:false},
  {name:"DriverListing",value:false},
  {name:"VehicleStatusTracking",value:false}, 
]

const branch = [
  {name:"CycleManagement",value:false},
  {name:"ReceiveNewStockfromTransit",value:false},
  {name:"BranchInventory",value:false},
  {name:"StockReturnOrder",value:false}, 
  {name:"FileReturnLoadingOrder",value:false},
  {name:"AddBranch",value:false},
  {name:"CreateNewCycle",value:false}, 
  {name:"BranchStructure",value:false},
  {name:"BranchCustomers",value:false},
  {name:"BranchAssets",value:false},
  {name:"BranchBudget",value:false}, 
  {name:"BranchCycleReview",value:false},
  {name:"BranchDiscountItems",value:false},
  {name:"BranchStaff",value:false}, 
]

const thriftPermissions = [
  {name:"Rebale",value:false},
  {name:"InventoryItemsGrading",value:false},
  {name:"PrintGradedItemsBarcode",value:false},
  {name:"OutstandingGradingOrders",value:false}, 
  {name:"DiscardItems",value:false},
  {name:"GradingOrderInquiry",value:false},
  {name:"GradingReports",value:false},
  {name:"DiscardedItems",value:false},
  {name:"WorkCenters",value:false}, 
]


const AssetManagementPermissions = [
  {name:"AssetPurchase",value:false},
  {name:"AssetLocationTransfer",value:false},
  {name:"AssetDisposal",value:false},
  {name:"AssetSale",value:false}, 
  {name:"AssetDepreciationorAppreciationRateAdjustments",value:false},
  {name:"AssetMovements",value:false},
  {name:"GeneralAssetsReport",value:false},
  {name:"CreateAsset",value:false},
  {name:"AssetCategory",value:false},
  {name:"AssetRateSetup",value:false}, 
]


const menuPermissions =[
  {name:"AssetManagement",value:false},
  {name:"Branches",value:false},
  {name:"CRM",value:false},
  {name:"Dashboard",value:false}, 
  {name:"Finance",value:false},
  {name:"HRM",value:false},
  {name:"ItemsandInventory",value:false},
  {name:"Payroll",value:false},
  {name:"Procurement",value:false},
  {name:"Sales",value:false},
  {name:"Transport",value:false},
  {name:"ThriftProcessing",value:false},
  {name:"Settings",value:false},
]
const Page = () => {
  
  const [openModule, setOpenModule] = useState<null | 'procurement' | 'sales' | 'itemsandInventory' | 'humanResourceManagement' | 'transport' | 'branch' | 'thrift' | 'asset'|'menu'>(null);



const handleBranchPermissions = () => {
  setOpenModule('branch');
};

const handleMenuPermissions = () => {
  setOpenModule('menu');
};

const handleAssetPermissions = () => {
  setOpenModule('asset');
};

const handleThriftPermissions = () => {
  setOpenModule('thrift');
};

const handleSalesPermissions = () => {
  setOpenModule('sales');
};

const handleTransportPermissions = () => {
  setOpenModule('transport');
};
const handleModalClose = () => {
  setOpenModule(null);
};
const handleProcursementPermission = () => {
  setOpenModule('procurement');
};

const handleInventoryPermission = () => {
  setOpenModule('itemsandInventory');
};
const handlehumanResourceManagementPermission = () => {
  setOpenModule('humanResourceManagement');
};


  const initialState: Roles = {
    name: "",
    description: "",
    permissions: []
  };

  const [role, setRole] = useState<Roles>(initialState);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRole(prev => ({
      ...prev,
      [name]: value
    }));
  };




  const handlePermissions = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRole(prev => {
      const exists = prev.permissions.find(p => p.name === name);
      let updatedPermissions;
  
      if (exists) {
        updatedPermissions = prev.permissions.map(p =>
          p.name === name ? { ...p, value: checked } : p
        );
      } else {
        updatedPermissions = [...prev.permissions, { name, value: checked }];
      }
  
      return { ...prev, permissions: updatedPermissions };
    });
  };
  
  
const [error, setError] = useState<string>("");
const [success, setSuccess] = useState<string>("");
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
    const response =await fetch("/api/auth/role", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
      })
    const echo = await response.json()
    if(!response.ok){
setError(echo.error || "Error Posting")
    } 
    else{
        setRole(initialState)
        setSuccess(echo.message || "Successfully Posted a role")
    }
    }
    catch (error) {
        setError("Failed to add role");
        console.error(error);
      }
  };

  return (
    <div>
      <title>User Permissions</title>
      <div className='bg-[#EFEFEF] min-h-fit mx-5 mt-1 rounded-md'>
        <h3 className='font-semibold text-[#1b798a] border-b-[1px] border-black mx-2'>Create New Role</h3>

        <form onSubmit={handleSubmit} className='p-4'>
          <div className='mb-4'>
            <label className='block text-sm text-gray-600'>Role Name:</label>
            <Input type='text' placeholder='Role Name' name='name' value={role.name} onChange={handleInput} />
          </div>

          <div className='mb-4'>
            <label className='block text-sm text-gray-600'>Description:</label>
            <Input type='text' placeholder='Description' name='description' value={role.description} onChange={handleInput} />
          </div>

          <h3 className='font-semibold text-[#1b798a] border-b-[1px] border-black mx-2 my-2'>Module Level Permissions</h3>
<div className='flex border-black border-[1px] my-1'>
<div className='w-fit py-4 my-2 px-4 cursor-pointer flex flex-col border-r-[2px] border-black'>
  <h6 className='text-[#8E530D] ' onClick={handleAssetPermissions}><span className='text-[#FF8C00]' >1. </span>Asset Management</h6>
  <h6 className='text-[#8E530D] ' onClick={handleBranchPermissions}><span className='text-[#FF8C00]'>2. </span>Branches</h6>
  <h6 className='text-[#8E530D] ' onClick={handlehumanResourceManagementPermission}><span className='text-[#FF8C00]'>3. </span>Human Resource Managment</h6>
  <h6 className='text-[#8E530D] '><span className='text-[#FF8C00]'>4. </span>Customer Relationship Management</h6>
  <h6 className='text-[#8E530D] '><span className='text-[#FF8C00]'>5. </span>Dashboard</h6>
  <h6 className='text-[#8E530D] '><span className='text-[#FF8C00]'>6. </span>Finance</h6>
  <h6 className='text-[#8E530D] ' onClick={handleInventoryPermission}><span className='text-[#FF8C00]'>7. </span>Items and Inventory</h6>
  <h6 className='text-[#8E530D] '><span className='text-[#FF8C00]'>8. </span>Payroll</h6>
  <h6 className='text-[#8E530D] '  onClick={handleProcursementPermission}><span className='text-[#FF8C00]'>9. </span>Procurement</h6>
  <h6 className='text-[#8E530D] '  onClick={handleSalesPermissions}><span className='text-[#FF8C00]'>10. </span>Sales</h6>
  <h6 className='text-[#8E530D] ' onClick={handleTransportPermissions }><span className='text-[#FF8C00]' >11. </span>Transport</h6>
  <h6 className='text-[#8E530D] ' onClick={handleThriftPermissions}><span className='text-[#FF8C00]'>12. </span>Thrift Processing</h6>
  <h6 className='text-[#8E530D] ' onClick={handleMenuPermissions}><span className='text-[#FF8C00]'>8. </span>Menu</h6>
</div>

<div className='my-2 mx-4'>
  {openModule === 'procurement' && 
  <div>
    <h4 className='font-mono font-bold text-base text-green-600 underline'>Procurement Module Permissions</h4>
  <div className='flex flex-wrap gap-2'>
    
    {procurementPermissions.map((val,idx)=>(<div key={idx} className="flex items-center gap-1">
      <Input type="checkbox"  name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
      <label>{val.name}</label>
    </div>))}
    
    </div> 
    <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
    </div>}
    
    {
      openModule==='sales' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Sales Module Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          SalesPermissions.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }



{
      openModule==='asset' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Asset Management Module Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          AssetManagementPermissions.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }


{
      openModule==='menu' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Menu Accessibility Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          menuPermissions.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }


{
      openModule==='thrift' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Thrifting Module Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          thriftPermissions.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }

{
      openModule==='branch' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Branch Module Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          branch.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }


{
      openModule==='transport' && <div>
        <h4 className='font-mono font-bold text-base text-green-600 underline'>Transport Module Permissions</h4>
        <div className='flex flex-wrap gap-2'>
        {
          transport.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
        
      </div>
      <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
      </div>
    }

{openModule === 'humanResourceManagement' && 
  <div>
    <h4 className='font-mono font-bold text-base text-green-600 underline'>human Resource Management Module Permissions</h4>
  <div className='flex flex-wrap gap-2'>
    
    {humanResourceManagement.map((val,idx)=>(<div key={idx} className="flex items-center gap-1">
      <Input type="checkbox"  name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
      <label>{val.name}</label>
    </div>))}
    
    </div> 
    <button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
    </div>}

    {
openModule ==='itemsandInventory' &&

<div>
<h4 className='font-mono font-bold text-base text-green-600 underline'>Items-and-Inventory Module Permissions</h4>
<div className='flex flex-wrap gap-2'>
{
          itemsAndInventoryPemissions.map((val,idx)=>(
          
          <div key={idx} className='flex items-center gap-1'>
            <Input type="checkbox" name={val.name}
      checked={role.permissions.find(p => p.name === val.name)?.value || false}
      onChange={handlePermissions}/>
            <label>{val.name}</label>
          </div>
          
         )) 
        }
</div>
<button onClick={handleModalClose} className='border-[1px] border-black rounded-md px-2 font-thin text-sm text-red-800'>Close</button>
</div>
    }
</div>
</div>
        

          <Button type='submit'>Submit</Button>
        </form>
        {success && <p className='text-green-600'>{success}</p>}
        {error && <p className='text-red-600'>{error}</p>}
        <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
      </div>
      
    </div>
  );
};

export default Page;
