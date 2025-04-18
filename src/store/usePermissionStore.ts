// stores/usePermissionStore.ts
import { create } from 'zustand';
import { getPermissions } from '@/components/utils/auth';

interface Permissions {
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
}

interface PermissionStore {
  permissions: Permissions | null;
  loading: boolean;
  fetchPermissions: () => Promise<void>;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  permissions: null,
  loading: true,

  fetchPermissions: async () => {
    try {
      const perms = await getPermissions();
      set({ permissions: perms, loading: false });
    } catch (err) {
      console.error('Failed to fetch permissions', err);
      set({ permissions: null, loading: false });
    }
  },
}));
