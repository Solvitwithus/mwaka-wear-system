"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import StudIcon from "@/assets/LinkBar.svg";
import Image from "next/image";
import { usePermissionStore } from "@/store/usePermissionStore";
import reportIcon from "@/assets/ReportIcon.svg";
import SettingsIcon from "@/assets/SettingsIcon.svg";
import { Skeleton } from "@heroui/skeleton";

type Permissions = {
  ReceiveSupplyIntoInventory: boolean;
  InventoryAdjustments: boolean;
  MiscelleneousStockRequisition: boolean;
  ApproveRequisition: boolean;
  InventoryGRN: boolean;
  SupplierInvoicing: boolean;
  InventoryInvoiceAllocation: boolean;
  InventoryConsumption: boolean;
  StockTake: boolean;
  ApproveStockTake: boolean;
  InventoryDirectSales: boolean;
  IssueStocktoBranch: boolean;
  BranchStockApproval: boolean;
  BranchStockTransfer: boolean;
  InventoryStatus: boolean;
  StoreRestockReport: boolean;
  StockAdjustmentsReports: boolean;
  InventoryStockRequisitionReport: boolean;
  InventoryMisclleneousReceivalReport: boolean;
  SupplierInvoicingReport: boolean;
  ConsumedInventoryReport: boolean;
  StocktakeReport: boolean;
  InventorySaleReport: boolean;
  StockIssueReport: boolean;
  ApprovedIssuesReport: boolean;
  StockTransferReport: boolean;
  ItemCategories: boolean;
  Items: boolean;
  UnitofMeasure: boolean;
  ItemType: boolean;
  SalesPricing: boolean;
  PurchasePricing: boolean;
  ItemWeight: boolean;
  Discounts: boolean;
  ItemCommission: boolean;
};

const transactions = [
  { name: "Receive Into Inventory", link: "/items-and-inventory/inventory-receival", image: StudIcon, permission: "ReceiveSupplyIntoInventory" },
  { name: "Inventory Adjustments", link: "/items-and-inventory/", image: StudIcon, permission: "InventoryAdjustments" },
  { name: "Miscelleneous Stock Requisition", link: "/items-and-inventory/", image: StudIcon, permission: "MiscelleneousStockRequisition" },
  { name: "Approve Requisition", link: "/items-and-inventory/", image: StudIcon, permission: "ApproveRequisition" },
  { name: "Inventory Goods Receive Note", link: "/items-and-inventory/", image: StudIcon, permission: "InventoryGRN" },
  { name: "Inventory Supplier Invoicing", link: "/items-and-inventory/", image: StudIcon, permission: "SupplierInvoicing" },
  { name: "Inventory Invoice Allocation", link: "/items-and-inventory/", image: StudIcon, permission: "InventoryInvoiceAllocation" },
  { name: "Inventory Consumption", link: "/items-and-inventory/", image: StudIcon, permission: "InventoryConsumption" },
  { name: "StockTake", link: "/items-and-inventory/", image: StudIcon, permission: "StockTake" },
  { name: "Approve StockTake", link: "/items-and-inventory/", image: StudIcon, permission: "ApproveStockTake" },
  { name: "Inventory Direct Sale", link: "/items-and-inventory/", image: StudIcon, permission: "InventoryDirectSales" },
  { name: "Issue Stock to Branch", link: "/items-and-inventory/", image: StudIcon, permission: "IssueStocktoBranch" },
  { name: "Branch Stock Approval", link: "/items-and-inventory/", image: StudIcon, permission: "BranchStockApproval" },
  { name: "Branch Stock Transfer", link: "/items-and-inventory/", image: StudIcon, permission: "BranchStockTransfer" },
];

const reportsandInquiry = [
  { name: "Inventory Status", link: "/items-and-inventory/", image: reportIcon, permission: "InventoryStatus" },
  { name: "Store Restock Report", link: "/items-and-inventory/", image: reportIcon, permission: "StoreRestockReport" },
  { name: "Stock Adjustments Report", link: "/items-and-inventory/", image: reportIcon, permission: "StockAdjustmentsReports" },
  { name: "Inventory Stock Requisition Report", link: "/items-and-inventory/", image: reportIcon, permission: "InventoryStockRequisitionReport" },
  { name: "Inventory Miscelleneous Receivals Report", link: "/items-and-inventory/", image: reportIcon, permission: "InventoryMisclleneousReceivalReport" },
  { name: "Supplier Invoicing Report", link: "/items-and-inventory/", image: reportIcon, permission: "SupplierInvoicingReport" },
  { name: "Consumed Inventory Report", link: "/items-and-inventory/", image: reportIcon, permission: "ConsumedInventoryReport" },
  { name: "StockTake Reports", link: "/items-and-inventory/", image: reportIcon, permission: "StocktakeReport" },
  { name: "Inventory Sale Report", link: "/items-and-inventory/", image: reportIcon, permission: "InventorySaleReport" },
  { name: "Stock Issue Report", link: "/items-and-inventory/", image: reportIcon, permission: "StockIssueReport" },
  { name: "Approved Issue Report", link: "/items-and-inventory/", image: reportIcon, permission: "ApprovedIssuesReport" },
  { name: "Stock Transfer Report", link: "/items-and-inventory/", image: reportIcon, permission: "StockTransferReport" },
];

const mainainance = [
  { name: "Items Categories", link: "/items-and-inventory/createitemcategory", image: SettingsIcon, permission: "ItemCategories" },
  { name: "Items Price", link: "/items-and-inventory/itemcreation", image: SettingsIcon, permission: "Items" },
  { name: "Units of Measure", link: "/items-and-inventory/unitofmeasure", image: SettingsIcon, permission: "UnitofMeasure" },
  { name: "Item Type", link: "/items-and-inventory/itemcreation", image: SettingsIcon, permission: "ItemType" },
];

const pricingandCost = [
  { name: "Sales Pricing", link: "/items-and-inventory/", image: SettingsIcon, permission: "SalesPricing" },
  { name: "Purchase Pricing", link: "/items-and-inventory/", image: SettingsIcon, permission: "PurchasePricing" },
  { name: "Item Commission", link: "/items-and-inventory/", image: SettingsIcon, permission: "ItemCommission" },
  { name: "Item Weight", link: "/items-and-inventory/", image: SettingsIcon, permission: "ItemWeight" },
  { name: "Discounts", link: "/items-and-inventory/", image: SettingsIcon, permission: "Discounts" },
];

// Inner component to handle client-side logic
function ItemsAndInventoryContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("Unauthorized");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading || !permissions) {
    return (
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
  }

  const filteredPricingandCost = pricingandCost.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredMainainance = mainainance.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredReportsandInquiry = reportsandInquiry.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredTransactions = transactions.filter((item) => permissions[item.permission as keyof Permissions]);

  return (
    <div className="bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md">
      {/* wrapper */}
      <div className="flex justify-center gap-4">
        {/* left content */}
        <div className="flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Items and Inventory Operations
          </span>
          <div className="ml-2">
            {filteredTransactions.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Items and Inventory Setups and Company Configuration
          </span>
          <div className="ml-2">
            {filteredPricingandCost.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* right content */}
        <div className="flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Items and Inventory Reports and Inquiries
          </span>
          <div className="ml-2">
            {filteredReportsandInquiry.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Items and Inventory Setups and Company Configuration
          </span>
          <div className="ml-2">
            {filteredMainainance.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <span className="bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer">Contact Support</span>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <ItemsAndInventoryContent />
    </Suspense>
  );
}