
"use client";
import React, { useEffect } from "react";
import { NavItems } from "./navitems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { usePermissionStore } from "@/store/usePermissionStore";
import { Skeleton } from "@heroui/skeleton";

type Permissions = {
  AssetManagement: boolean;
  Branches: boolean;
  CRM: boolean;
  Dashboard: boolean;
  Finance: boolean;
  HRM: boolean;
  ItemsandInventory: boolean;
  Payroll: boolean;
  Procurement: boolean;
  Sales: boolean;
  Transport: boolean;
  ThriftProcessing: boolean;
  Settings: boolean;
};

const NavMenu = () => {
  const { permissions, loading, fetchPermissions } = usePermissionStore();
  const pathname = usePathname();

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Show Skeleton while loading
  if (loading) {
    return (
      <div className="max-w-[300px] w-full flex items-center gap-3 p-1">
        <div>
          <Skeleton className="rounded-full w-8 h-8 bg-gray-300" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
          <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
        </div>
      </div>
    );
  }

  // Show fallback if no permissions are available
  if (!permissions) {
  return (
      <div className="max-w-[300px] opacity-35 w-full flex items-center gap-3 p-1">
        <div>
          <Skeleton className="rounded-full w-8 h-8 bg-gray-300" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg bg-gray-300" />
          <Skeleton className="h-3 w-4/5 rounded-lg bg-gray-300" />
        </div>
      </div>
    );
  }
  
  

  // Filter navigation items based on permission
  const filteredNavItems = NavItems.filter(
    (item) => permissions[item.permission as keyof Permissions]
  );

  return (
    <div className="flex ml-1 font-serif whitespace-nowrap">
      {filteredNavItems.map((nav, idx) => {
        const isActive = pathname.startsWith(nav.link);

        return (
          <Link
            key={idx}
            href={nav.link}
            className={clsx(
              "border-r-[1px] border-black px-2 gap-4 bg-[#D9D9D9] border-[1px]",
              isActive ? "text-[#1393AB] font-semibold" : "text-black"
            )}
          >
            <span className="font-semibold text-xs">{nav.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavMenu;
