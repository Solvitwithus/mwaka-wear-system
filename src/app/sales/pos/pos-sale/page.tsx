"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Logo from "@/assets/mwakawear-logo.png";
import { Trash2 } from "lucide-react";
import bcrypt from "bcryptjs";

const generateRandomInvoiceReference = `code-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
type ItemProduced = {
  itemCode: string;
  itemName: string;
  grade: string;
  quantity: number;
  sellingPrice: number;
  qtyToHold: number;
  qtyToDispatch: number;
};


type User = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  shortName: string;
  address: string;
  email: string;
  password: string;
  roleId: string;
  branch: string;
  phone1: string;
  phone2: string;
  description: string;
  role?: {
    name: string;
    permissions: { name: string; value: boolean }[];
  };
};

type PausedCart = {
  name: string;
  branchName: string;
  userId: string;
  items: {
    itemCode: string;
    itemName: string;
    qty: number;
    price: number;
    availableQty: number;
  }[];
};

type Payment = {
  id: string;
  mpesaReceipt: string;
  amount: number;
  phoneNumber: string;
  transactionTime: string; // ISO string
  status: string;
};

const SellPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [itemCode, setItemCode] = useState("");
  const [password, setPassword] = useState("");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [userPassword, setUserPassword] = useState("");
  const [codeToAdjust, setCodeToAdjust] = useState("");
   const [quantityToAdjust, setQuantityToAdjust] = useState("");
   
  const [pausedtransactionName, setPausedtransactionName] = useState("");
  const [cashAmount, setcashAmount] = useState("");
  const [cart, setCart] = useState<{ itemCode: string; itemName: string; qty: number; price: number; availableQty: number }[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [inventory, setInventory] = useState<ItemProduced[]>([]);
  const [error, setError] = useState("");
 const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
    const getCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/access");
      if (response.data?.user) {
        setUser(response.data.user);
        console.log("Logged-in user:", response.data.user);
      } else {
        console.warn("User object not found in /access response");
      }
    } catch (error) {
      console.error("Failed to fetch current user from /access:", error);
    }
  }, []);

  const [transactionsToVoid, setTransactionsToVoid] = useState<PausedCart[] | null>(null)
const canbeVoided = useCallback(async()=>{
try {
      const response = await axios.get("/api/auth/paused-carts");
      setTransactionsToVoid(response.data);
      console.log("Paused carts fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch paused carts:", error);
      setError("Failed to load paused carts.");
    }


},[])


  // Fetch inventory
  useEffect(() => {
    
    const fetchInventory = async () => {
      try {
        const response = await axios.get("/api/auth/grading-sheet");
        const sheets = response.data;
        const items = sheets
          .filter((sheet:any) => sheet.status.toLowerCase() === "received")
          .flatMap((sheet:any) => sheet.itemsProduced);
        setInventory(items);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };
    fetchInventory();
    getCurrentUser()
    canbeVoided();
  }, [getCurrentUser,canbeVoided]);
  

  // Handle item code input and lookup
  const handleItemLookup = () => {
    const item = inventory.find((i) => i.itemCode === itemCode);
    if (item) {
      setSelectedItem({ ...item, qty: 1 });
      setError("");
      addToCart()
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
    const [mpesaTransactionsMount, setMpesaTransactionsMount] = useState(false)
  const handleMpesaTransactions =()=>{
    setMpesaTransactionsMount(true)
  }
 // Fetch all payments from backend
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Payment[]>("/api/mpesa/recent");
      setPayments(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch M-Pesa payments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mpesaTransactionsMount) {
      fetchPayments();
    }
  }, [mpesaTransactionsMount, fetchPayments]);

  // Filter only paid transactions
  const paidTransactions = payments.filter((p) => p.status === "paid");


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
    <h2>Mwaka Wear Trading LTD</h2>
    <h6>P.O BOX 192-00946</h6>
    <h6>Nakuru</h6>
  <h5 class="fisal">----START OF FISCAL RECEIPT----</h5>
  <hr/>
    <p class="itemHeaders">Served By:${user?.firstName} ${user?.lastName}</p>    
    <p class="itemHeaders">Store: ${user?.branch}</p>
    <p class="invNumber">Invoice Number: ${generateRandomInvoiceReference}</p>
<p class="itemHeaders">Date: ${new Date().toLocaleString()}</p>
    <hr />

    
  

    <table>
    <thead>
    <tr>
    <th>ITEM</th>
     
      <th>PRICE</th>
      <th>QTY</th>
       <th>TOTAL</th>
    <tr>
    </thead>'
    <tbody>
    
      ${cart.map((itm: { itemName: string; price: number; qty: number }) => `
  <tr>
    <td>${itm.itemName}</td>
    <td>${itm.price.toFixed(2)}</td>
    <td>${itm.qty}pcs</td>
    <td>${itm.price.toFixed(0)}*${itm.qty}=${(itm.qty * itm.price).toFixed(0)}</td>
  </tr>
`).join("")}
   
    </tbody>
    </table>
    <div class="totals">
      <p style="  margin:0px;
             font-size:12px;
              font-weight:light;"><strong>Total:</strong> KES ${totalAmount.toFixed(2)}</p>
      <p style="  margin:0px;
             font-size:12px;
              font-weight:light;"><strong>Paid:</strong> KES ${paidAmount.toFixed(2)}</p>
      <p style="  margin:0px;
             font-size:12px;
              font-weight:light;"><strong>Change:</strong> KES ${(paidAmount - totalAmount).toFixed(2)}</p>
    </div>
    <hr />
     <p class="itemHeaders">Payment Method: Cash</p>
     <h6>Mpesa Till: <span style="font-weight:bold">3700922</span></h6>
 <p class="itemHeaders">For inquiries call or whats app us on</p>
 <h6>Phone: <span style="font-weight:bold">0746741528</span></h6>
  <h6>Thank you for shopping with Us</h6>
   <h6>**************Karibu Tena**************</h6>
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
              font-size:13px;
              font-weight:bold;
            }
            ul {
              list-style: none;
              padding: 0;
            }
          
            .totals {
             
              display:flex;
              flex-direction: column;
             align-items: flex-end;
           margin-top:2rem;
           margin-bottom:1rem

            }
              .itemHeaders{
          text-align:left;
              margin:0px;
              font-size:9px;
              font-weight:light;
              }

              h6{
               text-align: center;
              margin: 0px;
              font-size:10px;
              font-weight:semi-bold;
              }
              .invNumber{
               margin:0px;
              font-size:10px;
              font-weight:extra-light;
              }
              .fisal{
              text-align:center;
              margin:0;
              font-size:9px;
              font-weight:extre-bold;
    }
              th{
               font-size:11px;
              font-weight:madium;
              }
              thead{
               width: 100%;
              }
               td{
                font-size:13px;
              font-weight: 10px;
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
const [isCartPaused, setisCartPaused] = useState(false)
const [cartToDelete, setCartToDelete] = useState<any>(null);
const cartPause =()=>{
setisCartPaused(true)
}
const pauseCart =async()=>{

const payload = {...cart,name:pausedtransactionName,userId:user?.id,branchName:user?.branch}
console.log(payload);

  try {
    await axios.post("/api/auth/paused-carts", payload);
  
    
  }catch (err: any) {
    const message =
      err?.response?.data?.error || "Failed to save paused cart.";
    setError(message);
  }
setSelectedItem(null)
setCart([])
setPausedtransactionName("")
}

const [isvoid, setIsVoid] = useState(false)

const voidTransaction =()=>{
setIsVoid(true)

}

useEffect(() => {
  if (isvoid) {
    canbeVoided();
  }
}, [isvoid, canbeVoided]);

const handleHeldCartProcessing =(cartPause:any)=>{
  setCart(cartPause.items);
  setIsVoid(false); 

}
const [ispassword, setIsPassword] = useState(false)
const handleVoidingATransaction = (cartPause: any) => {
  setCartToDelete(cartPause); // store this cart
  setIsPassword(true);        // show the password modal
};



const deleteHeld = async (cartPause: any) => {
  try {
    if (!user?.password) {
      setError("User password not found.");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      setError("Wrong password. Cannot void cart.");
      return;
    }

    await axios.delete("/api/auth/paused-carts", {
      data: { pausedCartId: cartPause.id },
    });

    setIsPassword(false);
    canbeVoided();
    setCartToDelete(null);
  } catch (err) {
    console.error("Failed to delete paused cart", err);
    setError("Could not delete cart.");
  }
};

const handleEndShift =async()=>{
await axios.post("/api/auth/logout")
router.push("/")
}
const [isToEdit, setIsToEdit] = useState(false)
const handleEditQuantity =()=>{
setIsToEdit(true)
}
const itemToEdit = cart.find((item) => item.itemCode === codeToAdjust);

const handleActualEdit = () => {
  const parsedQty = parseInt(quantityToAdjust);

  if (!itemToEdit) {
    setError("Edit Failed! Item not found in cart.");
    return;
  }

  if (parsedQty > itemToEdit.availableQty) {
    setError(`Quantity cannot exceed available stock (${itemToEdit.availableQty})`);
    setQuantityToAdjust(itemToEdit.availableQty.toString());
    return;
  }

  const updatedCart = cart.map((item) => {
    if (item.itemCode === codeToAdjust) {
      return {
        ...item,
        qty: parsedQty,
      };
    }
    return item;
  });

  setCart(updatedCart);
  setIsToEdit(false);
  setError("");
};


const [isDiscountEligible, setIsDiscountEligible] = useState(false)
const IssueDiscount = () => {
  setIsDiscountEligible(true);
  setError("");
};

const ApproveDiscount = async () => {
  const discount = parseFloat(discountAmount);

  if (!user?.password) {
    setError("User not authenticated.");
    return;
  }

  const comparePassKey = await bcrypt.compare(userPassword, user.password);

  if (!comparePassKey) {
    setError("Wrong password. Cannot issue discount.");
    return;
  }

  if (isNaN(discount) || discount <= 0) {
    setError("Invalid discount amount.");
    return;
  }

  if (discount >= totalAmount) {
    setError("Discount can't be more than the total.");
    return;
  }

  setDiscountAmount(discount.toString());
  setTotalAmount(totalAmount - discount); // Update amount to be paid
  setIsDiscountEligible(false);
  setError("");
  setDiscountAmount("")
  setUserPassword("")
};
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Mwakawear Logo" width={50} height={50} className="rounded" />
          <h1 className="text-2xl font-bold text-[#FF8C00]">Mwakawear POS</h1>
        </div>
        <span className="text-red-500 cursor-pointer" onClick={()=>router.push("/sales/pos")}>Manual Exit</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 bg-[#2A2A2A] rounded-lg p-4 shadow-lg overflow-auto">
          <div className="flex gap-4 mb-4">
            <input
              type="text" autoFocus
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleItemLookup()}
              placeholder="Search item code here"
              className="bg-[#1F1F1F] text-white p-2 rounded w-full"
            />
            <button type="button"
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
                <thead className="bg-[#d35abf] text-white">
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
                      <button type="button"
                        onClick={addToCart}
                         onKeyUp={(e) => e.key === "Enter" && addToCart()}
                        className="bg-green-600 mr-1 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                       <button type="button" className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>{setSelectedItem(null),setItemCode("")}}>
              Cancel
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
                  <th className="p-2">Code</th>
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
                     <td className="p-2">{item.itemCode}</td>
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
            
            <button type="button" className="bg-teal-500 p-8 rounded hover:bg-teal-600 text-sm" onClick={handleCashPayment}>Cash</button>
             <button type="button" className="bg-teal-500 p-8 rounded hover:bg-teal-600 text-sm" onClick={handleMpesaTransactions}>M-Pesa</button>
              <button type="button" className="bg-teal-500 p-8 rounded hover:bg-teal-600 text-sm cursor-none">Prompt</button>
          
            <button type="button" className="bg-red-600 p-8 rounded hover:bg-red-700 text-sm" onClick={voidTransaction}>Void</button>
            <button type="button" className="bg-yellow-600 p-8 rounded hover:bg-yellow-700 text-sm" onClick={cartPause}>Pause Cart</button>
            <button type="button" className="bg-pink-600 p-8 rounded hover:bg-pink-700 text-sm" onClick={handleEditQuantity}>Edit</button>
            <button type="button" className="bg-orange-500 p-8 rounded hover:bg-orange-600 text-sm">Transactions</button>
            <button type="button" className="bg-purple-600 p-8 rounded hover:bg-purple-700 text-sm">Reports</button>
            <button type="button" className="bg-green-600 p-8 rounded hover:bg-green-700 text-sm" onClick={IssueDiscount}>Discount</button>
            <button type="button" className="bg-lime-600 p-8 rounded hover:bg-lime-700 text-sm" onClick={()=>router.push("/sales/pos")}>Inventory</button>
            <button type="button" className="bg-green-500 p-8 rounded hover:bg-green-600 text-sm">Receipts</button>
            <button type="button" className="bg-red-500 p-8 rounded hover:bg-red-600 text-sm" onClick={handleEndShift}>End Shift</button>
          </div>
        </div>
      </div>
{showCashUI && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
        Cash Payment
      </h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Enter the amount received from the customer.
      </p>

      <input
        type="number"
        step="0.01"
        min="0"
        autoFocus
        value={cashAmount}
        onChange={(e) => setcashAmount(e.target.value)}
        placeholder="Enter amount e.g. 1000"
        className="w-full px-4 py-2 mb-4 text-sm text-white bg-[#494646] rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-300"
      />

      <div className="flex justify-between gap-4">
        <button type="button"
          onClick={handleCashProcessment}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition"
        >
          💵 Process
        </button>

        <button type="button"
          onClick={() => setShowCashUI(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


{isCartPaused && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
        Pause Current Cart
      </h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Give this transaction a name so you can resume it later.
      </p>

      <input
        type="text"
        autoFocus
        placeholder="Transaction name e.g. Jane's Cart"
        value={pausedtransactionName}
        onChange={(e) => setPausedtransactionName(e.target.value)}
        className="w-full px-4 py-2 mb-4 text-sm text-white bg-[#494646] rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-300"
      />

      <div className="flex gap-4 justify-between">
        <button type="button"
          onClick={() => {
            pauseCart();
            setisCartPaused(false);
          }}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition"
        >
          ✅ Pause Cart
        </button>

        <button type="button"
          onClick={() => setisCartPaused(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{isvoid && transactionsToVoid && (
  <div className="fixed inset-0 z-50 bg-black top-10 left-10 bg-opacity-40 flex flex-col items-center justify-center">
    <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-white p-6 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
        Paused Carts
      </h2>

      {transactionsToVoid.length === 0 ? (
        <p className="text-center text-gray-500">No paused carts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {transactionsToVoid.map((cartPause: any, index: number) => {
            const totalItems =
              cartPause.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0;

            return (
              <div
              onClick={()=>handleHeldCartProcessing(cartPause)}
                key={index}
                className="bg-[#f4fdf7] border border-green-300 rounded-lg p-4 shadow-md hover:shadow-xl hover:bg-[#dff0e5] transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-[#124c36] mb-2">
                  {cartPause.name}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-gray-600">Branch:</span>{" "}
                  {cartPause.branchName}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-gray-600">Items:</span>{" "}
                  <span className="text-green-800 font-bold">{totalItems}</span>
                </p>
                <Trash2 color="red" className="hover:cursor-pointer" onClick={()=>handleVoidingATransaction(cartPause)}/>
              </div>
            );
          })}
        </div>
      )}
    </div>
       <button type="button" onClick={() => setIsVoid(false)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
      Close
    </button>
  </div>

)}
{ispassword && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-red-600 mb-4">Admin Authorization</h2>
      <p className="text-sm text-center text-gray-600 mb-4">Enter your password to confirm voiding this transaction.</p>

      <input
        type="password"
        autoFocus
        className="w-full px-4 py-2 mb-4 text-sm text-white bg-[#494646] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-300"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between gap-4">
        <button type="button"
          onClick={() => {
    deleteHeld(cartToDelete); // ✅ pass it here
    setIsPassword(false);
  }}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition"
        >
          Void ❌
        </button>

        <button type="button"
          onClick={() => setIsPassword(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{isToEdit && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-teal-700 mb-4">Edit Cart Item</h2>
      <p className="text-sm text-center text-gray-600 mb-4">Enter item code and the new quantity.</p>
<div className="flex flex-col gap-2">
      <input
        type="text"
        autoFocus
        placeholder="Item code (e.g. ITEM001)"
        className="w-full px-4 py-2 mb-3 text-sm text-white bg-[#494646] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-300"
        value={codeToAdjust}
        onChange={(e) => setCodeToAdjust(e.target.value)}
      />

      <input
        type="number"
        min={0}
        step={1}
        max={itemToEdit?.availableQty || undefined} 
        placeholder="New quantity"
        className="w-full px-4 py-2 mb-4 text-sm text-white bg-[#494646] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-300"
        value={quantityToAdjust}
        onChange={(e) => setQuantityToAdjust(e.target.value)}
      />
</div>
      {error && (
        <p className="text-sm text-red-600 text-center mb-2">{error}</p>
      )}

      <div className="flex justify-between gap-4">
        <button type="button"
          onClick={handleActualEdit}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition"
        >
          Save ✅
        </button>

        <button type="button"
          onClick={() => setIsToEdit(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{isDiscountEligible && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">Issue Discount</h2>
      <p className="text-sm text-center text-gray-600 mb-4">Enter discount amount and admin password.</p>
<div className="flex flex-col gap-2">
      <input
        type="number"
        min={0}
        step={0.01}
        autoFocus
        value={discountAmount}
        placeholder="Discount amount"
        onChange={(e) => setDiscountAmount(e.target.value)}
        className="w-full px-4 py-2 mb-3 text-sm text-white bg-[#494646] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
      />

      <input
        type="password"
        value={userPassword}
        placeholder="Admin password"
        onChange={(e) => setUserPassword(e.target.value)}
        className="w-full px-4 py-2 mb-4 text-sm text-white bg-[#494646] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
      />
</div>
      {error && <p className="text-sm text-red-600 text-center mb-2">{error}</p>}

      <div className="flex flex-col justify-between gap-4">
        <button type="button"
          
          onClick={ApproveDiscount}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition"
        >
          Issue Discount ✅
        </button>

        <button type="button"
          onClick={() => setIsDiscountEligible(false)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

 {mpesaTransactionsMount && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl max-h-[85vh] overflow-y-auto bg-white p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              M-Pesa Paid Transactions
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : paidTransactions.length === 0 ? (
              <p className="text-center text-gray-500">No paid transactions found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {paidTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="bg-[#f4fdf7] border border-green-300 rounded-lg p-4 shadow-md hover:shadow-xl hover:bg-[#dff0e5] transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold text-[#124c36] mb-2">
                      {txn.mpesaReceipt}
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium text-gray-600">Amount:</span>{" "}
                      <span className="text-green-800 font-bold">KES {txn.amount.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium text-gray-600">Phone:</span>{" "}
                      {txn.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium text-gray-600">Time:</span>{" "}
                      {new Date(txn.transactionTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">Status: {txn.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMpesaTransactionsMount(false)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    


    </div>
  );
};

export default SellPage;
