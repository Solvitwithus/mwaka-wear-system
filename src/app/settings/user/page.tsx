"use client"
import React,{ChangeEvent, FormEvent,useEffect,useCallback, useState} from 'react';
import SortIcon from '@/assets/sortIcon.svg'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Delete from "@/assets/deleteIcon.svg"
import Edit from '@/assets/editIcon.svg'

interface user{
  firstName:string,
  lastName:string,
  userName:string,
  shortName:string,
  address:string,
  email:string,
  password:string,
  roleId:string,
  branch:string,
  phone1:string,
  phone2:string,
  description:string
}
const initialState={
  firstName:"",
  lastName:"",
  userName:"",
  shortName:"",
  address:"",
  email:"",
  password:"",
  roleId:"",
  branch:"",
  phone1:"",
  phone2:"",
  description:""
}
const Page = () => {
  
  type fedrole = {
    id: string;
    name: string;
  }
  const [role, setRole] = useState<fedrole[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fetchRole =useCallback(async()=>{
try{
  const response = await fetch("/api/auth/role",{
    method: 'GET',
        headers: { 'Content-Type': 'application/json' },
  })
  const echo = await response.json()
  if(!response.ok){
setError(echo.error)
  }
  else{
    setRole(echo)
  }
}


catch (error) {
  setError(`Error fetching roles: ${error}`);
}



  },[])

  useEffect(()=>{
    fetchRole()
  },[])
  const [formData, setFormData] = useState<user>(initialState);


  const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
const {name,value} = e.target
setFormData({...formData,[name]:value})
  }
  const [refreshUsers, setRefreshUsers] = useState(false);
const handleUserCreation =async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  try{
    const response = await fetch("/api/auth/user",{
method:"POST",
headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    const echo = await response.json()
    if(!response.ok){
     setError(echo.error)
    }
    else{
      console.log(formData);
      
      setSuccess( echo.message)
      setFormData(initialState)
      setRefreshUsers(prev => !prev);
    }
  }
  catch (error) {
    setError(`Error fetching roles: ${error}`);
  }
  
  
  

}


const [usersFetched, setUsersFetched] = useState<user[]>([]);
// Update this useCallback hook
const fetchExistingUsers = useCallback(async () => {
  try {
    const response = await fetch("/api/auth/user", {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    });
    const echo = await response.json();
    if (!response.ok) {
      setError(echo.error || "Failed to fetch Users!");
    } else {
      setUsersFetched(echo);
     
    }
  } catch (err) {
    setError(`Error fetching: ${err}`);
  }
}, []);

useEffect(()=>{
  fetchExistingUsers()

},[refreshUsers])


useEffect(() => {
  if (error || success) {
    const timeout = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [error, success]);


  return (
    <>
    <title>User Creation</title>
   
    <div className='bg-[#EFEFEF] min-h-fit mx-5 mt-1 rounded-md' >
      
      <h3 className='font-semibold text-[#1b798a] border-b-[1px] border-black mx-2'>Create New User</h3>
      


<div className='flex justify-center'>
      <form onSubmit={handleUserCreation} className='border-[1px] border-black m-1 p-1 rounded-md'>
        {/* form content */}
        <div className='flex gap-6 border-b-[1px] border-black pb-1'>


{/* left-section */}
<div>
  <div className=' bg-[#f3dfda] p-1 flex justify-end items-center'>
    <label htmlFor='firstName' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>First Name</label>
    <input id='firstName' name='firstName' value={formData.firstName} onChange={handleInputChange} type="text" placeholder='john' className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50  px-2  focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className='bg-[#fff7f7] my-[0.09rem] p-1 flex justify-end items-center'>
    <label htmlFor='lastName' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Last Name</label>
    <input id='lastName' type="text" placeholder='Doe' name='lastName' value={formData.lastName} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className=' bg-[#f3dfda] p-1 flex justify-end items-center'>
    <label htmlFor='userName' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>User Name</label>
    <input id='userName' type="text" placeholder='johnDoe' name='userName' value={formData.userName} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className='bg-[#fff7f7] my-[0.09rem] p-1 flex justify-end items-center'>
    <label htmlFor='shortName' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Short Name</label>
    <input id='shortName' type="text" placeholder='Doe' name='shortName' value={formData.shortName} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className='bg-[#f3dfda] p-1 flex justify-end items-center'>
    <label htmlFor='address' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Address</label>
    <input id='address' type="text" placeholder='john' name='address' value={formData.address} onChange={handleInputChange} className='border-[#e6a89d] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className=' bg-[#fff7f7] p-1 flex justify-end items-center'>
    <label htmlFor='email' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Email</label>
    <input id='email' type="email" placeholder='johndoe@gmail.com' name='email' value={formData.email} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
  <div className='bg-[#f3dfda] my-[0.09rem] p-1 flex justify-end items-center'>
    <label htmlFor='password' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>password</label>
    <Input id='password' type="password" placeholder='set strong password' name='password' value={formData.password} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono' required/>
  </div>
</div>
{/* right dection */}
<div>

<div className='bg-[#f3dfda] p-1 flex justify-start items-center'>
  <label htmlFor='role' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Role</label>
  <select
    name='roleId'
    required
    value={formData.roleId}
    onChange={handleInputChange}
    id='role'
    className='border-[#ac4b3a] border-[0.5px] rounded-sm w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono'
  >
    <option value="">Select role</option>
    {role.map((val) => (
      <option key={val.id} value={val.id}>
        {val.name}
      </option>
    ))}
  </select>
</div>

  <div className='bg-[#fff7f7] my-[0.09rem] p-1 flex justify-start items-center'>
    <label htmlFor='branch' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Branch</label>
    <select id='branch' required name='branch' value={formData.branch} onChange={handleInputChange}className='border-[#ac4b3a] border-[0.5px] rounded-sm w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono'>
        <option>Kakamega</option>
        <option>Busia</option>
      </select>
  </div>
  <div className=' bg-[#f3dfda] p-1 flex justify-start items-center'>
    <label htmlFor='phone1' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Phone 1</label>
    <Input id="phone1" required type="tel" placeholder='+245 70000000' name='phone1' value={formData.phone1} onChange={handleInputChange} className='border-[#ac4b3a] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono'/>
  </div>
  <div className='bg-[#fff7f7] my-[0.09rem] p-1 flex justify-start items-center'>
    <label htmlFor='phone2' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Phone 2</label>
    <input id='phone2' required type="tel" placeholder='+245 70000000' name='phone2' value={formData.phone2} onChange={handleInputChange} className='border-[#244D00] border-[0.5px] rounded-sm h-5 w-50 px-2 focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono'/>
  </div>
  
  <div className='bg-[#f3dfda] my-[0.09rem] p-1 flex flex-col justify-start'>
    <label htmlFor='description' className='pr-2 text-[#1b798a] font-medium text-sm font-serif'>Description</label>
    <textarea id='description' name='description' value={formData.description} onChange={handleInputChange} placeholder='describe the role or add some comments' className='border-[#ac4b3a] border-[0.5px] rounded-md px-2focus:outline-dotted focus:border-blue-500 placeholder-gray-500 font-mono'></textarea>
  </div>

</div>



        </div>
        <div className='flex justify-center'>
        <button type='submit' className='text-sm font-medium text-[#1b8a24] mr-4'>Submit</button>
        <button className='text-sm font-medium text-[#d84949]'>Cancel</button>
        </div>
        
      </form>
      
        {success && <p className='text-green-500 absolute z-10 bottom-2 right-2 p-1 rounded-md bg-[#c3e44d] font-medium border-[1px] border-black'>{success}</p>}
        {error && <p className=' text-red-500 absolute z-10 bottom-2 right-2 p-1 rounded-md bg-[#c3e44d] font-medium border-[1px] border-black'>{error}</p>}
      
      </div>

      <h3 className='font-semibold text-[#1b798a] border-b-[1px] border-black mx-2 mb-1'>Existing USers</h3>

      {/* Display Section */}
      <div className='border-[#ac4b3a] border-x-[0.5px] border-t-[0.5px]  rounded-md w-fit flex flex-col mx-auto p-2' >
        <div className='flex justify-end border-b-2 border-black mb-2 p-1'>
<input type='text' placeholder='Search user' className='border-[1px] text-[#1b8a24] border-[#419253c9] px-3 w-36 py-0 my-0 mx-2 rounded-lg'/>
<select className='border-[1px] text-[#1b798a] border-[#419253c9] rounded-md'>
        <option>Role filter</option>
        <option>Admin</option>
        <option>Cashier</option>
      </select>
<Image src={SortIcon} alt='sortIcon' height={28} width={28} className='mx-1'/>
</div>

      
<div className='max-h-60 min-h-60 overflow-y-auto mb-2'>
  <table className="table-auto border-collapse w-full">
    <thead className="bg-[#1b798a] text-white font-sans text-sm sticky top-0">
      <tr>
        <th>No:</th>
        <th>Name:</th>
        <th>Role:</th>
        <th>email:</th>
        <th>Description</th>
        <th>phone:</th>
        <th>user Name:</th>
        <th>address:</th>
        <th>Branch:</th>
        <th>Short Name:</th>
        <th>Action</th>
      </tr>
    </thead>
 
    <tbody>
  {usersFetched.map((user, index) => (
    <tr key={user.userName}> {/* assuming username is unique */}
      <td>{index + 1}</td>
      <td>{user.firstName} {user.lastName}</td>
      <td>{role.find(r => r.id === user.roleId)?.name || "N/A"}</td>
      <td>{user.email}</td>
      <td>{user.description}</td>
      <td>{user.phone1}, {user.phone2}</td>
      <td>{user.userName}</td>
      <td>{user.address}</td>
      <td>{user.branch}</td>
      <td>{user.shortName}</td>
      <td className='flex gap-2 justify-center'>
        <Image src={Edit} alt="edit" width={18} height={18} />
        <Image src={Delete} alt="delete" width={18} height={18} />
      </td>
    </tr>
  ))}
</tbody>

    </table>
  
</div>




      </div>
    </div>
    </>
  );
}

export default Page;
