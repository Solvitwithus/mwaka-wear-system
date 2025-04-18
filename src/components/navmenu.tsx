"use client";
import React from "react";
import { NavItems } from "./navitems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Optional for clean class handling

const NavMenu = () => {
  const pathname = usePathname();

  return (
<div className="flex ml-1 font-serif whitespace-nowrap">
      {NavItems.map((nav, idx) => {
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
