

"use client";
import {Paperclip,SendIcon} from 'lucide-react'
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useState,useRef,useEffect,useCallback } from "react";
import axios from "axios";

const ChatUploader = () => {
  const [chatInput, setChatInput] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileoutput = useRef<HTMLInputElement>(null);

 const [refreshMessages, setRefreshMessages] = useState(false);
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
  
    const { data, error } = await supabase.storage
      .from("mwaka-weak-chathub")
      .upload(fileName, file);
  
    if (error) {
      console.error("Upload error:", error.message);
    
      setUploading(false);
      return;
    }
  
    const { data: publicUrlData } = supabase.storage
      .from("mwaka-weak-chathub")
      .getPublicUrl(fileName);
  
    if (publicUrlData?.publicUrl) {
      setFileUrl(publicUrlData.publicUrl); 
      console.log("Uploaded to ✔🐱‍👓🐱‍👓🐱‍👓✔✔✔🐱‍👓🐱‍👓:", publicUrlData.publicUrl);
     
    }
  
    setUploading(false);
  };

const [data, setData] = useState<any[]>([]);
const handleFetchfromMessageEndpoint = useCallback(async () => {
  try {
    const response = await axios.get("/api/auth/messages");
    setData(response.data); 
  } catch (err: any) {
    console.error("Failed to fetch messages:", err.message);
    setError("Failed to fetch messages");
  }
}, []);

  useEffect(()=>{handleFetchfromMessageEndpoint()},[refreshMessages])
  
  

  const handleSend = async () => {
    try {
      const res = await axios.post("/api/auth/messages", {
        chat: chatInput,
        file: fileUrl,
      });

      if (res.data.success) {
        setChatInput("");
        setFileUrl(null);
        setRefreshMessages(prev =>!prev)
      } else {
        setError(res.data.error || "Failed to send message");

      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const handleFilePopup =()=>{
    if(fileoutput.current){
      fileoutput.current.click()
    }
  }

  return (
    <div className="flex overflow-hidden max-h-max">
      <div className='flex flex-col border-r-[1px] border-black h-screen w-1/4 overflow-x-auto bg-red-700'>
        wawawawawwawawawawwueundhddndjdjdjdjd
        {
  Array.from(
    new Map(data.map((val) => [val.user.id, val])).values()
  ).map((uniqueVal) => (
    <div key={uniqueVal.user.id}>
      <span>{uniqueVal.user.userName}</span>
    </div>
  ))
}

      </div>
      <div className='flex flex-col  w-3/4 h-screen bg-slate-400 overflow-y-auto'>
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
      {Array.isArray(data) && data.length > 0 ? (
  data.map((msg: any) => (
    <div key={msg.id} className="my-2 rounded shadow">
      <p className='bg-red-400'>{msg.chat}</p>
      {msg.file && <img src={msg.file} alt="Uploaded" className="w-32 h-32 object-cover mt-2" />}
      <p className="text-sm text-gray-500 mt-1">{msg.user?.userName},{new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}</p>
    </div>
  ))
) : (
  <p className="text-gray-600">No messages yet</p>
)}

</div>
      {fileUrl && (
        <img src={fileUrl} alt="Uploaded preview" className="h-20 w-20 absolute bottom-12 rounded-md border-red-500 border-[1px] z-30 right-[40%]" />
      )}
      <div className='flex items-center relative  w-2/4 gap-3'>
<Paperclip onClick={handleFilePopup} className='absolute left-2'/>
      <Input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Send a message or attach an image"
        className='pl-9'
      />
      <SendIcon className='text-blue-600'  onClick={handleSend}/>
      </div>
</div>
      <Input
      className="hidden"
      ref={fileoutput}
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
        }}
      />

      

      
    </div>
  );
};

export default ChatUploader;
