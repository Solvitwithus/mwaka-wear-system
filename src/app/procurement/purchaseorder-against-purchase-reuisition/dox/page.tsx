"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
// Dynamically import the PDF Viewer (only on client-side)
const SupplierReqPDF = dynamic(() => import("@/components/SupplierReqPDF"), {
  ssr: false,
});

export default function ReviewPage() {
     const router = useRouter();
  return (
    <div style={{ height: "100vh" }}>
      <SupplierReqPDF />
   <button
              onClick={() => router.back()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold"
            >
              Cancel
            </button>
    </div>
  );
}
