import React from 'react';
import StudIcon from "@/assets/LinkBar.svg"
import Image from 'next/image';
import Link from 'next/link';
const page = () => {

  const companySetupDetail = [
    {title:"Company setup",link:"/settings/company", image:StudIcon},
    {title:"Create User",link:"/settings/user", image:StudIcon},
    {title:"Permission Assignment",link:"/settings/permissions", image:StudIcon},
    {title:"Display",link:"/settings/company", image:StudIcon},
    {title:"Tax Types",link:"/settings/company", image:StudIcon},
    {title:"Tax Groups",link:"/settings/company", image:StudIcon},
    {title:"Software Upgrade",link:"/settings/company", image:StudIcon},
    {title:"Void Transaction",link:"/settings/company", image:StudIcon},
    {title:"System Diagnostics",link:"/settings/company", image:StudIcon},
    {title:"Fiscal Years",link:"/settings/company", image:StudIcon},
    {title:"Profiles",link:"/settings/company", image:StudIcon},
    {title:"Module Overview",link:"/settings/company", image:StudIcon},

    

  ]
  return (
    <div className='bg-[#EFEFEF] min-h-fit mx-5 mt-1 rounded-md'>
      <div className='flex gap-2 justify-center'>
      <div className='bg-[#CACACA] w-2/3 border-[1px] border-black m-2 h-96 rounded-md'>
       <span className='absolute bg-[#006E7A] px-4 ml-2 rounded-md mt-1 py-1 w-fit text-[#FF8C00] font-semibold text-sm'>Company Configuration</span>
      
{companySetupDetail.map((val,idx)=>(
  <Link href={val.link} className='flex relative top-10 gap-2' key={idx}>
    <Image src={val.image} alt="studImage" height={20} width={20} title={val.link}/>
    <span className="cursor-pointer text-[#8E530D] font-medium text-sm">{val.title}</span>
  </Link>
))}
       
      </div>

      <div className='bg-[#CACACA] w-2/3 border-[1px] border-black m-2'>
        second
      </div>
      </div>
    </div>
  );
}

export default page;
