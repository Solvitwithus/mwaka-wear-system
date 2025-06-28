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
import React from "react";

type Permissions = {
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
};

const menu = [
  { name: "Point of Sale (POS)", link: "/sales/pos", image: StudIcon, permission: "PointOfSale" },
  { name: "Print Statement", link: "/sales/printstatement", image: StudIcon, permission: "PrintStatement" },
  { name: "Direct Sale", link: "/sales/directsales", image: StudIcon, permission: "DirectSale" },
  { name: "Customer Postings(Pre-payment)", link: "/sales/customerposting", image: StudIcon, permission: "CustomerPostings" },
  { name: "Sales Man Posting", link: "/sales/salesmanposting", image: StudIcon, permission: "SalesManPosting" },
  { name: "Customer Credit", link: "/sales/customercredit", image: StudIcon, permission: "CustomerCredit" },
  { name: "Customer Credit Payments", link: "/sales/customercreditpayments", image: StudIcon, permission: "CustomerCreditPayments" },
];

const submenu = [
  { name: "Sales Quotation Entry", link: "/sales/salesquotationentry", image: StudIcon, permission: "SalesQuotationEntry" },
  { name: "Sales Order Entry", link: "/sales/salesorderentry", image: StudIcon, permission: "SalesOrderEntry" },
  { name: "Delivery Against Sales Orders", link: "/sales/deliveryagainstsalesorders", image: StudIcon, permission: "DeliveryAgainstSalesOrders" },
  { name: "Invoice Against Sales Delivery", link: "/sales/invoiceagainstsalesdelivery", image: StudIcon, permission: "InvoiceAgainstSalesDelivery" },
  { name: "Invoice Prepaid Orders", link: "/sales/invoiceprepaidorders", image: StudIcon, permission: "InvoicePrepaidOrders" },
];

const reportsLeftItems = [
  { name: "Sales Dashboard", link: "/edit-customer", image: reportIcon, permission: "SalesDashboard" },
  { name: "Sales Quotation Inquiry", link: "/edit-customer", image: reportIcon, permission: "SalesQuotationInquiry" },
  { name: "Sales Order Inquiry", link: "/add-customer", image: reportIcon, permission: "SalesOrderInquiry" },
  { name: "Customer Transactions", link: "/edit-customer", image: reportIcon, permission: "CustomerTransactions" },
  { name: "Return Inquiry", link: "/edit-customer", image: reportIcon, permission: "ReturnInquiry" },
  { name: "Customer Balance", link: "/edit-customer", image: reportIcon, permission: "CustomerBalance" },
  { name: "POS Report", link: "/edit-customer", image: reportIcon, permission: "POSReport" },
  { name: "Salesman Detailed Listing", link: "/add-customer", image: reportIcon, permission: "SalesmanDetailedListing" },
  { name: "Credit Note Listing", link: "/edit-customer", image: reportIcon, permission: "CreditNoteListing" },
  { name: "Quick Inventory Check", link: "/edit-customer", image: reportIcon, permission: "QuickInventoryCheck" },
];

const reportsRightItems = [
  { name: "Salesman Posting Report", link: "/edit-customer", image: reportIcon, permission: "SalesmanPostingReport" },
  { name: "Invoice Listing", link: "/edit-customer", image: reportIcon, permission: "InvoiceListing" },
  { name: "Payments", link: "/add-customer", image: reportIcon, permission: "Payments" },
];

const setupItems = [
  { name: "Add and Manage Customers", link: "/sales/addandmanageclients", image: SettingsIcon, permission: "AddAndManageCustomers" },
  { name: "Customer Branches", link: "/sales/customer-branch-assignment", image: SettingsIcon, permission: "CustomerBranches" },
  { name: "Sales Group", link: "/sales/sales-group", image: SettingsIcon, permission: "SalesGroup" },
  { name: "Sales Type", link: "/sales/salestype", image: SettingsIcon, permission: "SalesType" },
  { name: "Sales Person", link: "/sales/salesperson", image: SettingsIcon, permission: "SalesPerson" },
  { name: "Sales Person Targets", link: "/edit-customer", image: SettingsIcon, permission: "SalesPersonTargets" },
  { name: "Sales Area", link: "/sales/salesarea", image: SettingsIcon, permission: "SalesArea" },
  { name: "Credit Status Setup", link: "/sales/credit-status-setup", image: SettingsIcon, permission: "CreditStatusSetup" },
];

// Inner component to handle client-side logic
function SalesContent() {
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

  const filteredMenu = menu.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredSubmenu = submenu.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredReportsLeftItems = reportsLeftItems.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredReportsRightItems = reportsRightItems.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredSetupItems = setupItems.filter((item) => permissions[item.permission as keyof Permissions]);

  return (
    <div className="bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md">
      {/* Wrapper */}
      <div className="flex justify-center gap-4">
        {/* Left Content */}
        <div className="flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-96 rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Sales Operations
          </span>
          <div className="ml-2">
            {filteredMenu.map((val, idx) => (
              <React.Fragment key={idx}>
                <Link href={val.link} className="flex gap-2 mb-1">
                  <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                  <span className="cursor-pointer font-medium text-sm">
                    {val.name.includes("Point of Sale (POS)") ? (
                      <>
                        <span className="text-black">Point of Sale </span>
                        <span className="text-[#F40000]">(POS)</span>
                      </>
                    ) : (
                      <span className="text-[#8E530D]">{val.name}</span>
                    )}
                  </span>
                </Link>

                {idx === 0 && (
                  <div className="my-2 ml-4">
                    {filteredSubmenu.map((val, idx) => (
                      <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                        <span className="cursor-pointer text-[#8e760d] font-medium text-sm">{val.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {error && <p className="text-red-500 ml-2">{error}</p>}
        </div>

        {/* Right Content */}
        <div className="flex flex-col bg-[#CACACA] w-2/4 border-[1px] border-black m-2 h-fit mb-10 rounded-md">
          <span className="bg-[#006E7A] px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Sales Reports and Inquiries
          </span>
          <div className="ml-2">
            {/* Upper Content */}
            <div className="flex gap-9">
              <div className="flex flex-col">
                {filteredReportsLeftItems.map((val, idx) => (
                  <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                    <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                    <span className="cursor-pointer text-[#249B00] font-medium text-sm">{val.name}</span>
                  </Link>
                ))}
              </div>
              <div className="flex flex-col">
                {filteredReportsRightItems.map((val, idx) => (
                  <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                    <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                    <span className="cursor-pointer text-[#249B00] font-medium text-sm">{val.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <span className="bg-[#006E7A] px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Sales Setups and Company Configuration
          </span>
          <div className="ml-2">
            {filteredSetupItems.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="cursor-pointer text-[#333333] font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <span className="bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer">Contact Support</span>
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
      <SalesContent />
    </Suspense>
  );
}