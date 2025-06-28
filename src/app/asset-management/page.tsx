"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import StudIcon from "@/assets/LinkBar.svg";
import reportIcon from "@/assets/ReportIcon.svg";
import SettingsIcon from "@/assets/SettingsIcon.svg";
import { Skeleton } from "@heroui/skeleton";

type Permissions = {
  AssetPurchase: boolean;
  AssetLocationTransfer: boolean;
  AssetDisposal: boolean;
  AssetSale: boolean;
  AssetDepreciationorAppreciationRateAdjustments: boolean;
  AssetMovements: boolean;
  GeneralAssetsReport: boolean;
  CreateAsset: boolean;
  AssetCategory: boolean;
  AssetRateSetup: boolean;
};

const transactions = [
  { name: "Asset Purchase", link: "/items-and-inventory/", image: StudIcon, permission: "AssetPurchase" },
  { name: "Asset Location Transfer", link: "/items-and-inventory/", image: StudIcon, permission: "AssetLocationTransfer" },
  { name: "Asset Disposal", link: "/items-and-inventory/", image: StudIcon, permission: "AssetDisposal" },
  { name: "Asset Sale", link: "/items-and-inventory/", image: StudIcon, permission: "AssetSale" },
  { name: "Asset Depreciation or Appreciation Rate Adjustments", link: "/items-and-inventory/", image: StudIcon, permission: "AssetDepreciationorAppreciationRateAdjustments" },
];

const setups = [
  { name: "Create Asset", link: "/items-and-inventory/", image: SettingsIcon, permission: "CreateAsset" },
  { name: "Asset Category", link: "/items-and-inventory/", image: SettingsIcon, permission: "AssetCategory" },
  { name: "Asset Rate Setup", link: "/items-and-inventory/", image: SettingsIcon, permission: "AssetRateSetup" },
];

const reports = [
  { name: "Asset Movements", link: "/items-and-inventory/", image: reportIcon, permission: "AssetMovements" },
  { name: "General Assets Report", link: "/items-and-inventory/", image: reportIcon, permission: "GeneralAssetsReport" },
];

const SkeletonLoader = () => (
  <div className="p-4">
    <div className="w-full opacity-20 space-y-5 p-4 rounded-lg border border-gray-300 shadow-md bg-white">
      <Skeleton className="rounded-lg h-24 bg-gray-300" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
        <Skeleton className="h-3 w-2/5 rounded-lg bg-gray-300" />
      </div>
    </div>
  </div>
);

// Component to isolate the useSearchParams hook inside Suspense
const ErrorBoundaryWrapper = ({ setError }: { setError: (val: string) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("Unauthorized");
    }
  }, [searchParams, setError]);

  return null;
};

const Page = () => {
  const [error, setError] = useState("");
  const { permissions, loading, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading || !permissions) return <SkeletonLoader />;

  const filteredTransactions = transactions.filter(
    (item) => permissions[item.permission as keyof Permissions]
  );
  const filteredReports = reports.filter(
    (item) => permissions[item.permission as keyof Permissions]
  );
  const filteredSetups = setups.filter(
    (item) => permissions[item.permission as keyof Permissions]
  );

  return (
    <div className="bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md">
      {/* Suspense-wrapped useSearchParams logic */}
      <Suspense fallback={null}>
        <ErrorBoundaryWrapper setError={setError} />
      </Suspense>

      <div className="flex justify-center gap-4">
        {/* Left Panel */}
        <div className="flex flex-col bg-[#CACACA] w-1/3 border border-black m-2 rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Asset Management Operations
          </span>
          <div className="ml-2">
            {filteredTransactions.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link} />
                <span className="text-[#8E530D] font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col bg-[#CACACA] w-2/3 border border-black m-2 rounded-md">
          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Asset Management Reports and Inquiries
          </span>
          <div className="ml-2">
            {filteredReports.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Report-icon" height={20} width={20} title={val.link} />
                <span className="text-[#249B00] font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>

          <span className="bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm">
            Asset Management Setups and Company Configuration
          </span>
          <div className="ml-2">
            {filteredSetups.map((val, idx) => (
              <Link href={val.link} key={idx} className="flex gap-2 mb-1">
                <Image src={val.image} alt="Setup-icon" height={20} width={20} title={val.link} />
                <span className="text-[#333333] font-medium text-sm">{val.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <span className="bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer">
        Contact Support
      </span>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default Page;
