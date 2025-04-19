"use client";
import React, { useEffect } from "react";
import { NavItems } from "./navitems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Optional for clean class handling
import { usePermissionStore } from '@/store/usePermissionStore';

type Permissions = {
  AssetManagement:Boolean;
  Branches:Boolean;
  CRM:Boolean;
  Dashboard:Boolean;
  Finance:Boolean;
  HRM:Boolean;
  ItemsandInventory:Boolean;
  Payroll:Boolean;
  Procurement:Boolean;
  Sales:Boolean;
  Transport:Boolean;
  ThriftProcessing:Boolean;
  Settings:Boolean;
  
 
  
}
const NavMenu = () => {

   const { permissions, loading, fetchPermissions } = usePermissionStore();
  
    useEffect(() => {
      fetchPermissions();
    }, [fetchPermissions]);
  
    if (loading) return <p>Loading...</p>;
    if (!permissions) return <p>Unauthorized</p>;
  const pathname = usePathname();
  const filteredNavItems = NavItems.filter(item => permissions[item.permission as keyof Permissions]);
  return (
<div className="flex ml-1 font-serif whitespace-nowrap">
      {filteredNavItems.map((nav, idx) => {
        const isActive = pathname === nav.link;

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
