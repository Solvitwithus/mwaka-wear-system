"use client"


import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import credentialImage from "@/assets/change-cedentials-icon.svg";
import logoutImage from "@/assets/logout.svg";
import axios from 'axios';
import Link from 'next/link';
import { ModeToggle } from './ui/darkmode';
import { useRouter } from 'next/navigation';
const Submenu = () => {
 const router = useRouter()
const handleCredentialChange = () => {
  alert("Change Credentials clicked!");
};

const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    router.refresh()
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const SubmenuItem = ({ icon, alt, label, textColor, handleEvent }: {
  icon: any;
  alt: string;
  label: string;
  textColor: string;
  handleEvent: () => void;
}) => (
  <div className='flex gap-2 items-center cursor-pointer' onClick={handleEvent}>
    <Image src={icon} alt={alt} height={18} width={18} />
    <span className={`${textColor} text-sm font-medium font-serif`}>{label}</span>
  </div>
);



 
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const warningTimer = setTimeout(() => {
      setSuccess("⚠️ Your token will expire in 1 minute");

      // Hide the warning after 5 seconds
      const clearSuccess = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(clearSuccess);
    }, 10740*1000);

    const logoutTimer = setTimeout(() => {
      setSuccess("🔒 Session expired. Please login again.");
      setTimeout(() => {
        router.refresh()
      }, 2000);
    }, 10800*1000);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, []);

  const menuItems = [
    {
      icon: credentialImage,
      alt: "Change Credentials Icon",
      label: "Change Credentials",
      textColor: "text-[#244D00]",
      handleEvent: handleCredentialChange
    },
    {
      icon: logoutImage,
      alt: "Logout Icon",
      label: "Log Out",
      textColor: "text-black",
      handleEvent: handleLogout
    },
  ];

  return (
    <>
      <nav className='flex justify-between items-center border border-black bg-[#D9D9D9] px-2 py-1 mx-1 mt-[0.5px] h-9'>
        <span className='text-[#894B00] text-sm font-semibold font-sans inline'>
          MwaKa Clothing Center | skeletalerpapp.vercel.com | SolvIt Support
          <Link href="/chathub" className='font-serif text-[#2b8508]'> --- ChatHub ---</Link>
        </span>
        <div className='flex gap-4'>
          {menuItems.map((item, index) => (
            <SubmenuItem key={index} {...item} />
          ))}
          <ModeToggle/>
        </div>
          
      </nav>

      {success && (
        <div className="bg-yellow-200 text-yellow-900 px-4 py-2 text-sm font-semibold mt-1 mx-1 rounded shadow z-10">
          {success}
        </div>
      )}
    </>
  );
};

export default Submenu;
