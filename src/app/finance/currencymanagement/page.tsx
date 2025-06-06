"use client";

import React, { FormEvent, useState,useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CoolMode } from "@/components/magicui/cool-mode";
import axios from 'axios';

type Currency = {
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
  currencyFormat: string;
  decimalPlaces: string;
  thousandSeparator: string;
  KSHtoUSDExchange: string;
  allowedforTransactions: boolean;
};

const CurrencyPage = () => {
  const router = useRouter();

  const initialState: Currency = {
    currencyName: "",
    currencySymbol: "",
    currencyCode: "",
    currencyFormat: "",
    decimalPlaces: "",
    thousandSeparator: "",
    KSHtoUSDExchange: "",
    allowedforTransactions: false,
  };

  const [currency, setCurrency] = useState<Currency>(initialState);

  const handleExploreClick = () => {
    router.push('/finance/currencymanagement/currencyexchangerates');
  };

 const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;

  if (e.target instanceof HTMLInputElement && type === 'checkbox') {
    const { checked } = e.target;
    setCurrency((prev) => ({
      ...prev,
      [name]: checked,
    }));
  } else {
    setCurrency((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const [error, setError] = useState<string>("")
const [success, setSuccess] = useState<string>("")
  const handleCurrencyAddition = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(JSON.stringify(currency, null, 2));
    try{
const response =await axios.post("/api/auth/currency",currency)
setSuccess(response.data.message)
setCurrency(initialState)
    }
    catch(er:any){
setError(er.response?.data?.error || 'Failed to create currency!');
    }
    // send currency to backend here
  };
 
const handleBack =()=>{
  router.back()
}
  return (
    <div className='bg-[#EFEFEF] m-1 rounded-md p-1 h-fit'>
      <h4 className='text-base font-semibold ml-2 mt-2 text-[#b13348]'>
        Currency Management
      </h4>

      <form
        className='border-black border-[1px] w-[90%] mx-auto m-3 rounded-md h-fit '
        onSubmit={handleCurrencyAddition}
      >
        <div className='border-black border-[1px] m-2 flex flex-col gap-4 px-11 py-6 rounded-md h-fit'>
          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='currencyName' className='text-sm text-black'>
              Currency Name:
            </label>
            <input
              type='text'
              name='currencyName'
              value={currency.currencyName}
              onChange={handleChange}
              className='bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]'
              placeholder='Kenyan Shillings'
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='currencySymbol' className='text-sm text-black'>
              Currency Symbol:
            </label>
            <input
              type='text'
              name='currencySymbol'
              value={currency.currencySymbol}
              onChange={handleChange}
              className='bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]'
              placeholder='KSH'
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='currencyCode' className='text-sm text-black'>
              Currency Code:
            </label>
            <input
              type='text'
              name='currencyCode'
              value={currency.currencyCode}
              onChange={handleChange}
              className='bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]'
              placeholder='KES'
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='currencyFormat' className='text-sm text-black'>
              Currency Format:
            </label>
            <input
              type='text'
              name='currencyFormat'
              value={currency.currencyFormat}
              onChange={handleChange}
            
              required
              className='bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]'
              placeholder='e.g., KSh 1,000.00'
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='decimalPlaces' className='text-sm text-black'>
              Decimal Places:
            </label>
            <input
              type='text'
              name='decimalPlaces'
              value={currency.decimalPlaces}
              onChange={handleChange}
              className='bg-[#D9D9D9] h-6 rounded-md pl-2 placeholder-[#e48383]'
              placeholder='.00'
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='thousandSeparator' className='text-sm text-black'>
              Thousand Separator:
            </label>
            <select
              name='thousandSeparator'
              value={currency.thousandSeparator}
              onChange={handleChange}
              className='bg-[#D9D9D9] h-6 rounded-md pl-2'
            >
              <option value=''>Select separator</option>
              <option value=','>,</option>
              <option value='.'>.</option>
              <option value=' '>(space)</option>
            </select>
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='KSHtoUSDExchange' className='text-sm text-black'>
              KSH to USD Exchange:
            </label>
            <input
              type='text'
              name='KSHtoUSDExchange'
              value={currency.KSHtoUSDExchange}
              className='bg-[#df8080] text-black pl-2 h-6 rounded-md'
             
              readOnly
              aria-readonly
            />
          </div>

          <div className='flex justify-center gap-2 mb-1'>
            <label htmlFor='allowedforTransactions' className='text-sm text-black'>
              Allowed for Transactions:
            </label>
            <input
              type='checkbox'
              name='allowedforTransactions'
              checked={currency.allowedforTransactions}
              onChange={handleChange}
              className='h-4 w-4 mt-1'
            />
          </div>

          <div className='flex gap-3 justify-center'>
            <button
              type='submit'
              className='bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md'
            >
              Add Currency
            </button>

            <CoolMode>
              <button
                type='button'
                onClick={handleExploreClick}
                className='bg-[#4E803F] mb-2 text-sm font-semibold px-3 py-[1px] text-white rounded-md'
              >
                explore rates (●'◡'●)
              </button>
            </CoolMode>
          </div>
        </div>
      </form>

      <button className='bg-[#E75D5D] text-sm px-3 ml-[51%] py-[1px] font-semibold text-white rounded-md' type='button' onClick={handleBack}>
        back
      </button>
           {error && <p style={{ color: 'red' }}>{error}</p>}
{success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default CurrencyPage;
