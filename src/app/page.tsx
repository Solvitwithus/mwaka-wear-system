'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {User2Icon,KeyIcon} from 'lucide-react'


import React,{ChangeEvent, FormEvent, useState} from "react";
import { setTimeout } from "timers/promises";
interface login{
  userName:string,
  password:string
}
const initialState ={
  userName:"",
  password:""
}
axios.defaults.withCredentials = true;
export default function Home() {
 
  const [userData, setuserData] = useState<login>(initialState);
  const [success, setSuccess] = useState<string>("");
const [error, setError] = useState<string>("");
  const handleUserInput =(e:ChangeEvent<HTMLInputElement>)=>{
const {name,value} = e.target
setuserData({...userData,[name]:value})
  }
  const handleAuthentication =async(e:FormEvent<HTMLFormElement>)=>{
e.preventDefault()
try{
const response = await axios.post("/api/auth/login",userData,{ withCredentials: true })

setSuccess(response.data.message)
setuserData(initialState)
window.location.href = "/procurement";





}
catch(err : any){
  setError(err.response?.data?.error || 'Failed to create user!');
}
  }

  const imageUrl = "/background.jpeg";
  return (
   
<>
<title>Login</title>

    <div
      className="flex justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat"

      style={{ backgroundImage: `url(${imageUrl})` }}
    >
    
    
<div className="border-[1px] border-[#535353] w-fit p-2 rounded-md">
   
   
    <div>
      <form onSubmit={handleAuthentication}>
        
        <div className="relative mb-1">
          <User2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
           
            placeholder="UserName"
            name="userName"
            value={userData.userName}
            onChange={handleUserInput}
            className="pl-10 placeholder-emerald-900"
            required
          />
        </div>
        
        <div className="relative mb-1">
          <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input type='password' required placeholder="Password" className="pl-10" name="password" value={userData.password} onChange={handleUserInput}/>
        </div>
       <div className="flex flex-col justify-center gap-2 mt-2">
       <Button type="submit" className="bg-[#006E7A] text-[#FF8C00]">Login</Button>
       <Button className="bg-[#FF8C00] text-[#006E7A]">Change Password</Button>
       </div>
       
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
{success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
    </div>
   </div>
   </>
  );
}
