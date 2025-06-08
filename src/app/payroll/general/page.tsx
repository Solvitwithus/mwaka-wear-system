'use client'

import Taxationpage from '@/components/ui/taxpage';
import React, { useState } from 'react';

const PayrollGeneralPage = () => {
  const generalMenu = [
    { name: 'Tax', key: 'tax' },
    { name: 'National Social Security Fund (NSSF)', key: 'nssf' },
    { name: 'National Health Insurance Fund (NHIF)', key: 'nhif' },
    { name: 'Social Health Authority (SHA)', key: 'sha' },
    { name: 'Relief', key: 'relief' },
  ];

  const [activeTab, setActiveTab] = useState<string>('tax');

  const renderForm = () => {
    switch (activeTab) {
      case 'tax':
        return <Taxationpage/>;
      case 'nssf':
        return <div>NSSF Form Goes Here</div>;
      case 'nhif':
        return <div>NHIF Form Goes Here</div>;
      case 'sha':
        return <div>SHA Form Goes Here</div>;
      case 'relief':
        return <div>Relief Form Goes Here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[rgb(239,239,239)] m-1 rounded-md p-1 h-fit">
      <div className="flex flex-wrap gap-2 mb-2 bg-[#666666]">
        {generalMenu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-4 py-2 rounded ${
              activeTab === item.key ? "text-[#1393AB] font-semibold" : "text-black"
            } hover:underline`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="border p-4 rounded shadow bg-white">
        {renderForm()}
      </div>
    </div>
  );
};

export default PayrollGeneralPage;
