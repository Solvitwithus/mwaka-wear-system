"use client";

import React, { useState, useCallback, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import Image from "next/image";
import axios from "axios";
import { Posmenu } from "@/components/posmenu";
import PosInventory from "@/components/pos-inventory";
import Logo from "@/assets/mwakawear-logo.png"; // Assume a custom logo for Mwakawear
import Support from "@/assets/support.png";
import LogoutImage from "@/assets/logout.svg";
import { FaChartLine, FaBoxOpen, FaMoneyBillWave, FaUsers } from "react-icons/fa";

// Types for analytics data
type AnalyticsData = {
  totalSales: number;
  inventoryValue: number;
  lowStockItems: number;
  activeCustomers: number;
};

const PosLandingPage = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSales: 0,
    inventoryValue: 0,
    lowStockItems: 0,
    activeCustomers: 0,
  });

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      // Mock API call for analytics (replace with actual endpoint)
      const response = await axios.get("/api/pos/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white font-sans">
      {/* Navbar */}
      <nav className="bg-[#1F1F1F] border-b border-[#FF8C00]/20 flex items-center justify-between px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Mwakawear Logo" height={50} width={50} className="rounded-full" />
          <h1 className="text-2xl font-bold text-[#FF8C00] tracking-wide">
            Mwakawear POS
            <span className="text-sm block text-[#A4F1FF]/80">Powered by <span className="text-green-700"> ScriptCruise</span></span>
          </h1>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <Menu
            isOpen={isMenuOpen}
            onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
            right
            width={280}
            customBurgerIcon={<div className="text-[#FF8C00] text-2xl">☰</div>}
            className="bg-[#1F1F1F] shadow-xl"
          >
            <div className="flex flex-col items-center gap-4 mt-10">
              {Posmenu.map((val, idx) => (
                <a
                  key={idx}
                  href={val.link}
                  className="text-[#A4F1FF] flex justify-center gap-4 mr-4 bg-[#1393AB]/20 rounded-md border mb-1 text-lg hover:text-[#FF8C00] transition-colors"
                >
                  {val.name}
                </a>
              ))}
              <div className="mt-10 flex flex-col gap-4 w-full px-6">
                <button className="flex items-center gap-3 bg-[#1393AB]/20 border border-[#A4F1FF]/30 rounded-lg p-3 hover:bg-[#1393AB]/40 transition">
                  <Image src={Support} alt="Support" height={24} width={24} />
                  <span>Contact Support</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 bg-[#FF8C00]/20 border border-[#FF8C00]/30 rounded-lg p-3 hover:bg-[#FF8C00]/40 transition"
                >
                  <Image src={LogoutImage} alt="Logout" height={24} width={24} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </Menu>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 bg-[#1F1F1F] border-r border-[#FF8C00]/20 h-[calc(100vh-80px)] p-6 sticky top-0">
          <nav className="flex flex-col gap-4 mt-10">
            {Posmenu.map((val, idx) => (
              <a
                key={idx}
                href={val.link}
                className="text-[#A4F1FF] text-lg hover:text-[#FF8C00] transition-colors py-2 px-4 rounded-lg hover:bg-[#1393AB]/10"
              >
                {val.name}
              </a>
            ))}
          </nav>
          <div className="absolute bottom-6 w-full px-4">
            <button className="flex items-center gap-3 w-[90%] bg-[#1393AB]/20 border border-[#A4F1FF]/30 rounded-lg p-3 hover:bg-[#1393AB]/40 transition mb-2">
              <Image src={Support} alt="Support" height={24} width={24} />
              <span>Contact Support</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-[90%] bg-[#FF8C00]/20 border border-[#FF8C00]/30 rounded-lg p-3 hover:bg-[#FF8C00]/40 transition"
            >
              <Image src={LogoutImage} alt="Logout" height={24} width={24} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-[#1393AB]/20 border border-[#A4F1FF]/20 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1393AB]/30 transition transform hover:scale-105">
              <FaMoneyBillWave className="text-[#FF8C00] text-3xl" />
              <div>
                <h3 className="text-[#A4F1FF] font-semibold">Total Sales</h3>
                <p className="text-2xl font-bold text-white">KES {analytics.totalSales.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-[#1393AB]/20 border border-[#A4F1FF]/20 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1393AB]/30 transition transform hover:scale-105">
              <FaBoxOpen className="text-[#FF8C00] text-3xl" />
              <div>
                <h3 className="text-[#A4F1FF] font-semibold">Inventory Value</h3>
                <p className="text-2xl font-bold text-white">KES {analytics.inventoryValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-[#1393AB]/20 border border-[#A4F1FF]/20 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1393AB]/30 transition transform hover:scale-105">
              <FaChartLine className="text-[#FF8C00] text-3xl" />
              <div>
                <h3 className="text-[#A4F1FF] font-semibold">Low Stock Items</h3>
                <p className="text-2xl font-bold text-white">{analytics.lowStockItems}</p>
              </div>
            </div>
            <div className="bg-[#1393AB]/20 border border-[#A4F1FF]/20 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1393AB]/30 transition transform hover:scale-105">
              <FaUsers className="text-[#FF8C00] text-3xl" />
              <div>
                <h3 className="text-[#A4F1FF] font-semibold">Active Customers</h3>
                <p className="text-2xl font-bold text-white">{analytics.activeCustomers}</p>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#FF8C00]/20 shadow-lg">
            <h2 className="text-2xl font-bold text-[#FF8C00] mb-6">Inventory Overview</h2>
            <PosInventory />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PosLandingPage;