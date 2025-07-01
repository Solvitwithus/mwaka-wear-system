"use client"
import React,{ChangeEvent, FormEvent,useEffect,useCallback, useState} from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Delete from "@/assets/deleteIcon.svg"
import Edit from '@/assets/editIcon.svg'
import axios from 'axios';
import { ArrowUpDown} from 'lucide-react';

type BranchOffice = {
  branchCode: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
  description?: string;
};

type User = {
  id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  shortName: string;
  address: string;
  email: string;
  roleId: string;
  branch: string;
  phone1: string;
  phone2: string;
  description?: string;
  role?: Role;
};

const initialState: User = {
  id: '',
  userName: '',
  password: '',
  firstName: '',
  lastName: '',
  shortName: '',
  address: '',
  email: '',
  roleId: '',
  branch: '',
  phone1: '',
  phone2: '',
  description: '',
};
const Page = () => {
  
  
   const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
    const [branchOffices, setBranchOffices] = useState<BranchOffice[]>([]);
const [usersFetched, setUsersFetched] = useState<User[]>([]);
 
   const [editingUser, setEditingUser] = useState<User | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
const [filterRole, setFilterRole] = useState('');
const [sortAsc, setSortAsc] = useState(true);
      const fetchData = useCallback(async () => {
    try {
      const [usersResponse, rolesResponse, branchesResponse] = await Promise.all([
        axios.get('/api/auth/user'),
        axios.get('/api/auth/role'),
        axios.get('/api/auth/addbranch'),
      ]);
      setUsersFetched(usersResponse.data);
      setRoles(rolesResponse.data);
      setBranchOffices(branchesResponse.data);
    } catch (err: any) {
      setError('Failed to fetch data');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

    const fetchBranch = useCallback(async()=>{
      try{
        const response = await axios.get("/api/auth/addbranch")
        setBranchOffices(response.data);
      }
      catch (err: any) {
      setError("Failed to fetch data");
    }
    },[])
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
    setRoles(echo)
  }
}


catch (error) {
  setError(`Error fetching roles: ${error}`);
}



  },[])

  useEffect(()=>{
    fetchRole()
    fetchBranch()
  },[fetchRole,fetchBranch])
  const [formData, setFormData] = useState<User>(initialState);


  const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
const {name,value} = e.target
setFormData({...formData,[name]:value})
  }
 
const handleUserCreation =async(e:FormEvent<HTMLFormElement>)=>{
   e.preventDefault();
    try {
      const url = editingUser ? `/api/auth/user/${editingUser.id}` : '/api/auth/user';
      const method = editingUser ? 'PUT' : 'POST';
      const response = await axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess(response.data.message || (editingUser ? 'User updated successfully' : 'User created successfully'));
      setFormData(initialState);
      setEditingUser(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save user');
    }
  };





useEffect(() => {
  if (error || success) {
    const timeout = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [error, success]);


  const handleDelete = async (id: string) => {
   
      try {
        await axios.delete(`/api/auth/user/${id}`);
        setSuccess('User deleted successfully');
        fetchData();
      } catch (err: any) {
        setError('Failed to delete user');
      }
    
  };
const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({...user,password:""});
  };


  const filteredUsers = usersFetched
  .filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || roles.find(r => r.id === user.roleId)?.name === filterRole;
    return matchesSearch && matchesRole;
  })
  .sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    if (sortAsc) return nameA.localeCompare(nameB);
    else return nameB.localeCompare(nameA);
  });

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
    {roles.map((val) => (
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
        {branchOffices.map((val,idx)=>(
          <option key={idx} value={val.name }>{val.name}:{val.branchCode}</option>
        ))}
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
        <button type='submit' className='text-sm font-medium text-[#1b8a24] transition mr-4' >{editingUser ? 'Update User' : 'Create User'}</button>
        <button className='text-sm font-medium text-[#d84949]' onClick={()=>{setFormData(initialState);setEditingUser(null);}}>Cancel</button>
        </div>
        
      </form>
      
        {success && <p className='text-white absolute z-10 bottom-2 right-2 p-1 rounded-md bg-green-500 font-medium border-[1px] border-black'>{success}</p>}
        {error && <p className=' text-white absolute z-10 bottom-2 right-2 p-1 rounded-md bg-red-500 font-medium border-[1px] border-black'>{error}</p>}
      
      </div>

      <h3 className='font-semibold text-[#2e8a1b] border-b-[1px] border-black mx-2 mb-1'>Existing Users</h3>

      {/* Display Section */}
      <div className='border-[#ac4b3a] border-x-[0.5px] border-t-[0.5px]  rounded-md w-[99%] flex flex-col mx-auto p-2' >
        <div className='flex justify-end border-b-2 border-black mb-2 p-1'>
<input
  type='text'
  placeholder='Search user'
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className='border-[1px] text-[#1b8a24] border-[#419253c9] px-3 w-36 h-6 py-0 my-0 mx-2 rounded-lg'
/>

<select
  value={filterRole}
  onChange={(e) => setFilterRole(e.target.value)}
  className='border-[1px] text-[#1b798a] border-[#419253c9] rounded-md'
>
  <option value="">Filter by Role</option>
  {roles.map((val) => (
    <option key={val.id} value={val.name}>{val.name}</option>
  ))}
</select>

<ArrowUpDown
  height={20}
  width={20}
  className='cursor-pointer'
  onClick={() => setSortAsc(!sortAsc)}
/>


</div>

      
<div className='max-h-56 min-h-56 overflow-y-auto mb-2'>
  <table className="text-left text-sm border-collapse w-full">
    <thead className="bg-[#1b798a] text-white font-sans text-sm sticky top-0">
      <tr>
        <th className='border border-[#777777]'>No:</th>
        <th className='border border-[#777777]'>Name:</th>
        <th className='border border-[#777777]'>Role:</th>
        <th className='border border-[#777777]'>email:</th>
        <th className='border border-[#777777]'>Description</th>
        <th className='border border-[#777777]'>phone:</th>
        <th className='border border-[#777777]'>user Name:</th>
        <th className='border border-[#777777]'>address:</th>
        <th className='border border-[#777777]'>Branch:</th>
        <th className='border border-[#777777]'>Short Name:</th>
        <th className='border border-[#777777]'>Action</th>
      </tr>
    </thead>
 
    <tbody>
  {
  filteredUsers.length === 0 ?
  <tr>
  <td colSpan={11} className="text-center p-4 border border-[#777777]">
                    No user records found!
                  </td></tr>:
  filteredUsers.map((user, index) => (
    <tr key={user.userName} className='hover:bg-[#f3dfda] cursor-pointer'> 
      <td className='border border-[#777777]'>{index + 1}</td>
      <td className='border border-[#777777]'>{user.firstName} {user.lastName}</td>
      <td className='border border-[#777777]'>{roles.find(r => r.id === user.roleId)?.name || "N/A"}</td>
      <td className='border border-[#777777]'>{user.email}</td>
      <td className='border border-[#777777]'>{user.description}</td>
      <td className='border border-[#777777]'>{user.phone1}, {user.phone2}</td>
      <td className='border border-[#777777]'>{user.userName}</td>
      <td className='border border-[#777777]'>{user.address}</td>
      <td className='border border-[#777777]'>{user.branch}</td>
      <td className='border border-[#777777]'>{user.shortName}</td>
      <td className='flex space-x-2 border border-[#777777]'>
        <button onClick={() => handleEdit(user)}>
        <Image src={Edit} alt="edit" width={18} height={18} />
        </button>
        <button onClick={()=>handleDelete(user.id)}>
        <Image src={Delete} alt="delete" width={18} height={18}/>
        </button>
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
