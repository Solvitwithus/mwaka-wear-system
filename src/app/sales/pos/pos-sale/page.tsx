"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import PosInventory from "@/components/pos-inventory";
import Logo from "@/assets/mwakawear-logo.png";

type ItemProduced = {
  itemCode: string;
  itemName: string;
  grade: string;
  quantity: number;
  sellingPrice: number;
  qtyToHold: number;
  qtyToDispatch: number;
};


const SellPage = () => {
  const [itemCode, setItemCode] = useState("");
  const [cashAmount, setcashAmount] = useState("");
  const [cart, setCart] = useState<{ itemCode: string; itemName: string; qty: number; price: number; availableQty: number }[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [inventory, setInventory] = useState<ItemProduced[]>([]);
  const [error, setError] = useState("");

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("/api/auth/grading-sheet");
        const sheets = response.data;
        const items = sheets
          .filter((sheet) => sheet.status.toLowerCase() === "received")
          .flatMap((sheet) => sheet.itemsProduced);
        setInventory(items);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  // Handle item code input and lookup
  const handleItemLookup = () => {
    const item = inventory.find((i) => i.itemCode === itemCode);
    if (item) {
      setSelectedItem({ ...item, qty: 1 });
      setError("");
    } else {
      setSelectedItem(null);
      setError("Item code not found!");
    }
  };

  // Add to cart
  const addToCart = () => {
    if (!selectedItem) return;
    if (selectedItem.qty <= 0) {
      setError("Quantity must be positive!");
      return;
    }
    if (selectedItem.qty > selectedItem.qtyToDispatch) {
      setError("Quantity exceeds available stock!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.itemCode === selectedItem.itemCode);
      if (existing) {
        const newQty = existing.qty + selectedItem.qty;
        if (newQty > selectedItem.qtyToDispatch) {
          setError("Quantity exceeds available stock!");
          return prev;
        }
        return prev.map((item) =>
          item.itemCode === selectedItem.itemCode ? { ...item, qty: newQty } : item
        );
      }

      return [...prev, {
        itemCode: selectedItem.itemCode,
        itemName: selectedItem.itemName,
        qty: selectedItem.qty,
        price: selectedItem.sellingPrice,
        availableQty: selectedItem.qtyToDispatch
      }];
    });

    setSelectedItem(null);
    setItemCode("");
    setError("");
  };

  const updateQty = (itemCode: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.itemCode === itemCode
          ? {
              ...item,
              qty: Math.max(0, Math.min(item.qty + delta, item.availableQty)),
            }
          : item
      )
    );
  };

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalAmount(newTotal);
    setPaidAmount(0);
  }, [cart]);

  const handlePayment = (method: string) => {
    const balance = totalAmount - paidAmount;
    if (balance > 0) {
      alert(`Please pay the remaining balance of KES ${balance.toLocaleString()} via ${method}`);
      return;
    }
    alert(`Payment of KES ${totalAmount.toLocaleString()} via ${method} successful!`);
    setCart([]);
    setPaidAmount(0);
  };

const printReceipt = (cart:any, totalAmount:any, paidAmount:any) => {
  const content = `
    <h2>My Store</h2>
    <p>Date: ${new Date().toLocaleString()}</p>
    <hr />
    <ul>
      ${cart.map(item => `
        <li>
          ${item.itemName} x${item.qty} @ KES ${item.price.toFixed(2)} = KES ${(item.qty * item.price).toFixed(2)}
        </li>
      `).join("")}
    </ul>
    <div class="totals">
      <p><strong>Total:</strong> KES ${totalAmount.toFixed(2)}</p>
      <p><strong>Paid:</strong> KES ${paidAmount.toFixed(2)}</p>
      <p><strong>Change:</strong> KES ${(paidAmount - totalAmount).toFixed(2)}</p>
    </div>
    <hr />
    <p style="text-align: center;">Thanks and welcome again!</p>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-size: 12px;
              font-family: monospace;
              margin: 0;
              padding: 10px;
              width: 80mm;
            }
            h2 {
              text-align: center;
              margin-bottom: 10px;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              margin: 4px 0;
            }
            .totals {
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }
};


const [showCashUI, setShowCashUI] = useState(false);

const handleCashPayment = () => {
  setShowCashUI(true);
};

const handleCashProcessment = async() => {
  const parsedAmount = parseFloat(cashAmount);
  setPaidAmount(parsedAmount);

  if (parsedAmount >= totalAmount) {
   
    printReceipt(cart, totalAmount, parsedAmount);
    setCart([]);
       try {
      // ✅ 2. Reduce qtyToDispatch in backend
      await axios.patch("/api/auth/update-item-quantity", {
        soldItems: cart.map((item) => ({
          itemCode: item.itemCode,
          qty: item.qty,
        })),
      });

      console.log("Quantities updated successfully");
    } catch (err) {
      console.error("❌ Failed to update item quantities", err);
    }
  }
  setShowCashUI(false);
  setcashAmount("");
};

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Mwakawear Logo" width={50} height={50} className="rounded" />
          <h1 className="text-2xl font-bold text-[#FF8C00]">Mwakawear POS</h1>
        </div>
        <span className="text-red-500 cursor-pointer">Manual Exit</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 bg-[#2A2A2A] rounded-lg p-4 shadow-lg overflow-auto">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleItemLookup()}
              placeholder="Search item code here"
              className="bg-[#1F1F1F] text-white p-2 rounded w-full"
            />
            <button
              onClick={handleItemLookup}
              className="bg-[#FF8C00] text-white px-4 py-1 rounded"
            >
              Search
            </button>
          </div>

          {/* Show selected item */}
          {selectedItem && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Item Found</h2>
              <table className="w-full text-sm border border-gray-700">
                <thead className="bg-[#1393AB] text-white">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Grade</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Dispatchable</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="p-2">{selectedItem.itemCode}</td>
                    <td className="p-2">{selectedItem.itemName}</td>
                    <td className="p-2">{selectedItem.grade}</td>
                    <td className="p-2">KES {selectedItem.sellingPrice}</td>
                    <td className="p-2">{selectedItem.qtyToDispatch}</td>
                    <td className="p-2">{selectedItem.qty}</td>
                    <td className="p-2">
                      <button
                        onClick={addToCart}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="overflow-auto h-[calc(100%-100px)]">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-[#1393AB] text-white">
                  <th className="p-2">No.</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item.itemCode} className="text-center">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.itemName}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">KES {item.price.toLocaleString()}</td>
                    <td className="p-2">KES {(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <div>
              <p>Total Amount: KES {totalAmount.toLocaleString()}</p>
              <p>Paid Amount: KES {paidAmount.toLocaleString()}</p>
              <p className="text-green-500">Balance Amount: KES {(totalAmount - paidAmount).toLocaleString()}</p>
            </div>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Enter paid amount"
              className="bg-[#1F1F1F] text-white p-2 rounded w-1/3"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3 bg-[#2A2A2A] rounded-lg p-4 shadow-lg flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-2 h-full">
            <button className="bg-teal-500 p-8 rounded hover:bg-teal-600 text-sm" onClick={handleCashPayment}>Cash</button>
            {["Mpesa", "PDQ"].map((method) => (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                className="bg-teal-500 p-8 rounded flex items-center justify-center hover:bg-teal-600 transition text-sm"
              >
                {method}
              </button>
            ))}
            <button className="bg-red-600 p-8 rounded hover:bg-red-700 text-sm">Void</button>
            <button className="bg-yellow-600 p-8 rounded hover:bg-yellow-700 text-sm">Pause Cart</button>
            <button className="bg-pink-600 p-8 rounded hover:bg-pink-700 text-sm">Edit</button>
            <button className="bg-orange-500 p-8 rounded hover:bg-orange-600 text-sm">Transactions</button>
            <button className="bg-purple-600 p-8 rounded hover:bg-purple-700 text-sm">Reports</button>
            <button className="bg-green-600 p-8 rounded hover:bg-green-700 text-sm">Discount</button>
            <button className="bg-lime-600 p-8 rounded hover:bg-lime-700 text-sm">Inventory</button>
            <button className="bg-green-500 p-8 rounded hover:bg-green-600 text-sm" onClick={printReceipt}>Print</button>
            <button className="bg-red-500 p-8 rounded hover:bg-red-600 text-sm">End Shift</button>
          </div>
        </div>
      </div>
      {showCashUI && (
  <div className="absolute top-5 left-1/2 z-50 bg-white text-black p-4 mt-4 rounded shadow-lg">
    <h2 className="text-xl font-semibold">Cash Payment</h2>
    <p>Proceed with cash transaction...</p>
    <div className="flex gap-4 items-center">
      <input
  type="number"
  step="0.01"
  min="0" value={cashAmount} onChange={(e)=>setcashAmount(e.target.value)}
  className="bg-[#494646] w-32 h-8 text-white p-2 rounded"
/>
 <button onClick={handleCashProcessment} className="mt-2 bg-[#0c3d0c] text-white px-3 py-1 rounded">
      Process
    </button>
    </div>
    <button onClick={() => setShowCashUI(false)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
      Close
    </button>
  </div>
)}
    </div>
  );
};

export default SellPage;
