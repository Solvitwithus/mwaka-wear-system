
"use client";

import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import React, { useRef, useState } from "react";
import axios from "axios";
import { UploadButton } from "@/utils/uploadthing"; // Adjust import path accordingly
import "@uploadthing/react/styles.css";

interface KeyedInData {
  chat: string;
  fileUrl: string;
}

const Page = () => {
  const [chatInput, setChatInput] = useState<KeyedInData>({
    chat: "",
    fileUrl: "",
  });

  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChatInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleDataSubmission = async () => {
    try {
      const response = await axios.post("/api/auth/messages", {
        chat: chatInput.chat,
        file: chatInput.fileUrl,
      });
console.log("see",response);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError("");
        setChatInput({ chat: "", fileUrl: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-red-400 border-r-[1px] w-[31%] max-w-[31%] h-screen border-black flex-col flex-wrap break-words p-2">
        {/* Add any sidebar content here */}
      </div>

      {/* Input Section */}
      <div className="absolute bottom-4 right-2 w-2/3 z-50">
        {error && <span className="text-red-500">{error}</span>}

        {/* Preview */}
        {chatInput.fileUrl && (
          <div className="z-10 w-40 max-h-40 bg-white p-2 rounded shadow border mb-2">
            <img
              src={chatInput.fileUrl}
              alt="preview"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        <div className="font-serif flex items-center">
          <Paperclip className="text-black cursor-pointer mr-2" />

          <Input
            type="text"
            required
            placeholder="Group Chat"
            className="mr-2"
            name="chat"
            value={chatInput.chat}
            onChange={handleInputChange}
          />

          {/* UploadThing button */}
        {/*  <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]?.url) {
                setChatInput((prev) => ({ ...prev, fileUrl: res[0].url }));
              }
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              setError("Upload failed. Try again.");
            }}
          />

          <Send
            className="cursor-pointer text-blue-500 ml-2"
            onClick={handleDataSubmission}
          />*/}




<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Upload response:", res);
    const uploadedFile = res?.[0];
  
    if (uploadedFile?.ufsUrl) {
      setChatInput((prev) => ({ ...prev, fileUrl: uploadedFile.ufsUrl }));
    } else {
      setError("Upload succeeded but no URL was returned.");
    }
  
    setIsUploading(false);
  }}
  
/>

<Send
  className={`cursor-pointer ml-2 ${
    isUploading ? "text-gray-400 cursor-not-allowed" : "text-blue-500"
  }`}
  onClick={() => {
    if (!isUploading) handleDataSubmission();
  }}
/>
        </div>
      </div>
    </div>
  );
};

export default Page;
