"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import StudIcon from "@/assets/LinkBar.svg"
import Image from 'next/image';
import { usePermissionStore } from '@/store/usePermissionStore';
import reportIcon from '@/assets/ReportIcon.svg'
import SettingsIcon from '@/assets/SettingsIcon.svg'

type Permissions = {
  AssetPurchase:Boolean;
  AssetLocationTransfer:Boolean;
  AssetDisposal:Boolean;
  AssetSale:Boolean;
  AssetDepreciationorAppreciationRateAdjustments:Boolean;
  AssetMovements:Boolean;
  GeneralAssetsReport:Boolean;
  CreateAsset:Boolean;
  AssetCategory:Boolean;
  AssetRateSetup:Boolean;
  
 
  
}

const transactions = [
  {name:"Asset Purchase", link:"/items-and-inventory/",image:StudIcon,permission:"AssetPurchase"},
  {name:"Asset Location Transfer", link:"/items-and-inventory/",image:StudIcon,permission:"AssetLocationTransfer"},
  {name:"Asset Disposal", link:"/items-and-inventory/",image:StudIcon,permission:"AssetDisposal"},
  {name:"Asset Sale", link:"/items-and-inventory/",image:StudIcon,permission:"AssetSale"},
  {name:"Asset Depreciation or Appreciation Rate Adjustments", link:"/items-and-inventory/",image:StudIcon,permission:"AssetDepreciationorAppreciationRateAdjustments"},
]

const setups =[
  {name:"Create Asset", link:"/items-and-inventory/",image:SettingsIcon,permission:"CreateAsset"},
  {name:"Asset Category", link:"/items-and-inventory/",image:SettingsIcon,permission:"AssetCategory"},
  {name:"Asset Rate Setup", link:"/items-and-inventory/",image:SettingsIcon,permission:"AssetRateSetup"},
]

const reports =[
  {name:"Asset Movements", link:"/items-and-inventory/",image:reportIcon,permission:"AssetMovements"},
  {name:"General Assets Report", link:"/items-and-inventory/",image:reportIcon,permission:"GeneralAssetsReport"},
 
]
const page = () => {
   const searchParams = useSearchParams();
  
    const err = searchParams.get("error");
  const [error, setError] = useState<string>("");
    useEffect(() => {
      if (err === "unauthorized") {
        
       setError("Unauthorized")}
    }, [err]);
  
    const { permissions, loading, fetchPermissions } = usePermissionStore();
  
    useEffect(() => {
      fetchPermissions();
    }, [fetchPermissions]);
  
    if (loading) return <p>Loading...</p>;
    if (!permissions) return <p>Unauthorized</p>;
  const filteredReport = reports.filter(item => permissions[item.permission as keyof Permissions]);  
const filteredSetup = setups.filter(item => permissions[item.permission as keyof Permissions]);  
const filteredTransactions = transactions.filter(item => permissions[item.permission as keyof Permissions]);  
  return (
    <div className=' bg-[#EFEFEF] h-max mx-5 mt-1 rounded-md'>
    {/* wrapper */}
    <div className='flex justify-center gap-4'>
      {/* left content */}
      <div className=' flex flex-col bg-[#CACACA] w-1/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Operations</span>
    <div className='ml-2'>
      {
       filteredTransactions.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#8E530D] cursor-pointer font-medium text-sm">{val.name}</span>
        </Link>))
      }
      
      </div>
      </div>

      {/* right content */}
      <div className=' flex flex-col bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-fit rounded-md'>
    <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Reports and Inquiries</span>
    <div className='ml-2'>
    {
       filteredReport.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
        <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
        <span className="text-[#249B00] cursor-pointer font-medium text-sm">{val.name}</span>
        </Link>))
      }
      </div>
      <span className=' bg-[#006E7A] mb-2 px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Procurement Setups and Company Configuration</span>
      <div className='ml-2'>
        {
          filteredSetup.map((val,idx)=>(<Link href={val.link} key={idx} className='flex gap-2 mb-1'>
            <Image src={val.image} alt="Stud-icon" height={20} width={20} title={val.link}/>
            <span className="text-[#333333] cursor-pointer font-medium text-sm">{val.name}</span>
            </Link>))
        }
      </div>
      </div>
    </div>
    <span className='bg-[#FF8C00] text-white font-bold px-3 py-1 rounded-md cursor-pointer'>Contact Support</span>
  </div>
  );
}

export default page;
