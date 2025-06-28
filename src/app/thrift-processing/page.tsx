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
  Rebale: boolean;
  InventoryItemsGrading: boolean;
  PrintGradedItemsBarcode: boolean;
  OutstandingGradingOrders: boolean;
  DiscardItems: boolean;
  GradingOrderInquiry: boolean;
  GradingReports: boolean;
  DiscardedItems: boolean;
  WorkCenters: boolean;
  Grade: boolean;
  DispatchToBranch: boolean;
};

const transactions = [
  { name: "Rebale", link: "/thrift-processing/", image: StudIcon, permission: "Rebale" },
  { name: "Inventory Items Grading", link: "/thrift-processing/inventory-item-grading", image: StudIcon, permission: "InventoryItemsGrading" },
  { name: "Print Graded Items Barcode", link: "/thrift-processing/graded-item-barcode", image: StudIcon, permission: "PrintGradedItemsBarcode" },
  { name: "Outstanding Grading Orders", link: "/thrift-processing/", image: StudIcon, permission: "OutstandingGradingOrders" },
  { name: "Discard Damaged Items", link: "/thrift-processing/", image: StudIcon, permission: "DiscardItems" },
  { name: "Dispatch to Branch", link: "/thrift-processing/dispatch-to-branch", image: StudIcon, permission: "DispatchToBranch" },
];

const setups = [
  { name: "Create Mini-Work Centers", link: "/thrift-processing/", image: SettingsIcon, permission: "WorkCenters" },
  { name: "Create Grades", link: "/thrift-processing/create-grades", image: SettingsIcon, permission: "Grade" },
];

const reports = [
  { name: "Grading Order Inquiry", link: "/thrift-processing/", image: reportIcon, permission: "GradingOrderInquiry" },
  { name: "Grading Reports", link: "/thrift-processing/", image: reportIcon, permission: "GradingReports" },
  { name: "Discarded Items", link: "/thrift-processing/", image: reportIcon, permission: "DiscardedItems" },
];

// Inner component to handle client-side logic
function ThriftProcessingContent() {
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

  const filteredReport = reports.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredSetup = setups.filter((item) => permissions[item.permission as keyof Permissions]);
  const filteredTransactions = transactions.filter((item) => permissions[item.permission as keyof Permissions]);

  return (
    <div className="bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md">
      {/* wrapper */}
      <div className="flex justify-center gap-4">
        {/* left content */}
        <div className="flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Thrift Operations
          </span>
          <div className="ml-2">
            {filteredTransactions.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
          {error && <p className="text-red-500 ml-2">{error}</p>}
        </div>

        {/* right content */}
        <div className="flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Thrift Reports and Inquiries
          </span>
          <div className="ml-2">
            {filteredReport.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Thrift Setups and Company Configuration
          </span>
          <div className="ml-2">
            {filteredSetup.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
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
      <ThriftProcessingContent />
    </Suspense>
  );
}