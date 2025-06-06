"use client"
import { Posmenu } from '@/components/posmenu';
import React from 'react';
import logoutImage from "@/assets/logout.svg";
import axios from 'axios';
import Image from 'next/image';
const page = () => {
  const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
    <div>
      <div className='border-b-[1px] border-black'>
<h5>SCRIPTCRUISE POS</h5>
      </div>
      {/* POS Menu */}
      <div className='border-r-[1px] border-black ml-2 h-screen w-1/6 flex items-center'>
      <div className=''>
{Posmenu.map((val,idx)=>(<div key={idx} className=''>
<h6>{val.name}</h6>
</div>))}

<div className='flex flex-col'>
  <button type='button'>
    Contact Support
  </button>
   <button type='button' onClick={handleLogout}>
    <Image src={logoutImage} alt='logout'/>
    Log Out
  </button>
</div>
</div>
      </div>
    </div>
  );
}

export default page; 
