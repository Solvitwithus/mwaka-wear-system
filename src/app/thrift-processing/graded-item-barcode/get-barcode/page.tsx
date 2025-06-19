"use client";

import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";

interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  grade: string;
  quantity: number;
  sellingPrice: number;
  qtyToHold: number;
}

interface Grading {
  id: string;
  branch: string;
  itemtoGrade: string;
  gradeReference: string;
  workCenter: string;
  gradeDate: string;
  baleName: string;
  grader: string;
  baleWeight: number;
  itemCount: number;
  damageCount: number;
  damageWeight: number;
  unpairedCount: number;
  itemsProduced: Item[];
}

const Page = () => {
  const [gradeOrder, setGradeOrder] = useState<Grading | null>(null);
  const [barcodesToPrint, setBarcodesToPrint] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem("printBarcodes");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setGradeOrder(parsed);
      } catch (error) {
        console.error("Failed to parse grading data:", error);
      }
    }
  }, []);

  const generateBarcodes = () => {
    if (!gradeOrder) return;
    const codes: string[] = [];

    gradeOrder.itemsProduced.forEach((item) => {
      const toRelease = item.quantity - item.qtyToHold;
      for (let i = 0; i < toRelease; i++) {
        codes.push(JSON.stringify({ ...item, key: `${item.itemCode}-${i}` }));
      }
    });

    setBarcodesToPrint(codes);
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup && barcodesToPrint.length > 0) {
      setTimeout(() => {
        const svgs = document.querySelectorAll(".barcode-canvas");
        svgs.forEach((el) => {
          const svg = el as SVGSVGElement;
          const code = svg.getAttribute("data-code");
          if (code) {
            const parsed = JSON.parse(code);
            JsBarcode(svg, parsed.itemCode, {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 40,
              displayValue: true,
            });
          }
        });
      }, 100); // Delay to ensure elements are rendered
    }
  }, [barcodesToPrint, showPopup]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const popup = window.open("", "_blank", "width=800,height=600,top=100,left=200");
      if (popup) {
        popup.document.write(`
          <html>
          <head>
            <title>Print Barcodes</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              .label { border: 1px solid #000; margin: 10px; padding: 10px; width: 200px; height: 100px; text-align: center; }
              .labels-wrapper { display: flex; flex-wrap: wrap; gap: 10px; }
            </style>
          </head>
          <body>
            <div class="labels-wrapper">
              ${barcodesToPrint.map((code) => {
                const item = JSON.parse(code);
                return `
                  <div class="label">
                    <strong>Mwaka Wear</strong><br/>
                    ${item.itemName}<br/>
                    KES ${item.sellingPrice}<br/>
                    <svg class="barcode-canvas" data-code='${JSON.stringify(item)}'></svg>
                  </div>
                `;
              }).join("")}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
              document.querySelectorAll('.barcode-canvas').forEach(svg => {
                const code = JSON.parse(svg.getAttribute("data-code"));
                JsBarcode(svg, code.itemCode, {
                  format: "CODE128",
                  lineColor: "#000",
                  width: 2,
                  height: 40,
                  displayValue: true,
                });
              });
              window.onload = () => window.print();
            </script>
          </body>
          </html>
        `);
        popup.document.close();
      }
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <div className="bg-white rounded-md shadow overflow-auto mb-4">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-[#1393AB] text-white">
            <tr>
              <th className="px-4 py-2 border">Branch Name</th>
              <th className="px-4 py-2 border">Grade Reference</th>
              <th className="px-4 py-2 border">Work Center</th>
              <th className="px-4 py-2 border">Grade Date</th>
              <th className="px-4 py-2 border">Bale Name</th>
              <th className="px-4 py-2 border">Item Count</th>
              <th className="px-4 py-2 border">Grader</th>
              <th className="px-4 py-2 border">Bale Weight</th>
            </tr>
          </thead>
          <tbody>
            {gradeOrder ? (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{gradeOrder.branch}</td>
                <td className="px-4 py-2 border">{gradeOrder.gradeReference}</td>
                <td className="px-4 py-2 border">{gradeOrder.workCenter}</td>
                <td className="px-4 py-2 border">{gradeOrder.gradeDate}</td>
                <td className="px-4 py-2 border">{gradeOrder.baleName}</td>
                <td className="px-4 py-2 border">{gradeOrder.itemCount}</td>
                <td className="px-4 py-2 border">{gradeOrder.grader}</td>
                <td className="px-4 py-2 border">{gradeOrder.baleWeight}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">No grading orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Produced Items */}
          <div className="flex justify-center flex-col">
        <h2 className="text-base text-center font-semibold ml-2 mt-2 text-[#f33555]">Produced Items</h2>
        <div className="rounded-md shadow overflow-auto">
          <table className="w-[40%] mx-auto table-auto border-collapse text-sm rounded-md shadow overflow-auto">
            <thead className="bg-[#1393AB] text-white">
              <tr>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Grade</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Selling Price</th>
                <th className="px-4 py-2 border">Quantity Held</th>
                <th className="px-4 py-2 border">Qty to Release</th>
                <th className="px-4 py-2 border">Print 🖨️</th>
              </tr>
            </thead>
            <tbody>
              {gradeOrder?.itemsProduced.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.itemName}</td>
                  <td className="px-4 py-2 border">{item.itemCode}</td>
                  <td className="px-4 py-2 border">{item.grade}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.sellingPrice}</td>
                  <td className="px-4 py-2 border">{item.qtyToHold}</td>
                  <td className="px-4 py-2 border">{item.quantity - item.qtyToHold}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={generateBarcodes}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
              {gradeOrder?.itemsProduced.length === 0 && (
                <tr><td colSpan={8} className="text-center py-4 text-gray-500">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Print Area */}
      {showPopup && (
        <div style={{ display: "none" }}>
          <div ref={printRef}></div>
          {handlePrint()}
        </div>
      )}
    </div>
  );
};

export default Page;
