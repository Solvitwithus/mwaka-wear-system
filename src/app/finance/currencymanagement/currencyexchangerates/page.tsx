'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'KES', 'JPY', 'AUD', 'CAD', 'CNY', 'INR', 'ZAR',
  'NGN', 'CHF', 'BRL', 'MXN', 'SEK', 'SGD', 'NOK', 'NZD', 'KRW', 'RUB'
];

const CurrencyTable = () => {
  const [data, setData] = useState<Record<string, Record<string, number>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      const cachedData = localStorage.getItem('currencyRates');
      const cachedTime = localStorage.getItem('currencyRatesTime');
      const now = Date.now();
      const cacheDuration = 60 * 60 * 1000; // 1 hour

      if (cachedData && cachedTime && now - parseInt(cachedTime) < cacheDuration) {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);


        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `https://api.exchangerate.host/live?access_key=e307a54b2ad6963a10c6c4f15ddf201e`;
        const res = await fetch(url);
        const result = await res.json();

        if (result.success && result.quotes) {
          const rates: Record<string, number> = {};

          CURRENCIES.forEach((currency) => {
            if (currency === 'USD') {
              rates['USD'] = 1;
            } else {
              const key = `USD${currency}`;
              if (result.quotes[key]) {
                rates[currency] = result.quotes[key];
              }
            }
          });

          const finalData = { Today: rates };

          setData(finalData);
          localStorage.setItem('currencyRates', JSON.stringify(finalData));
          localStorage.setItem('currencyRatesTime', now.toString());

          // Save KSH rate separately
          const kshRate = rates.KES;
          if (kshRate) {
            localStorage.setItem('kshRate', kshRate.toString());
          }

        } else {
          setError(result.error?.info || "Error fetching data.");
          setData({});
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError("Network error! Failed to fetch exchange rates.");
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-center mt-4 text-red-500">No data available.</p>;
  }

  const dates = Object.keys(data).sort();
  const graphCurrencies = ['USD', 'EUR', 'GBP'];

  const datasets = graphCurrencies.map((currency, idx) => ({
    label: currency,
    data: dates.map(date => data[date]?.[currency] ?? null),
    borderColor: ['#3b82f6', '#10b981', '#f59e0b'][idx],
    backgroundColor: 'transparent',
    tension: 0.3,
  }));

  const chartData = { labels: dates, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Exchange Rates Over Time (Base: USD)',
        font: { size: 14 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { font: { size: 12 } },
      },
      x: {
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Exchange Rates (Base: USD)</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1 border">Date</th>
            {CURRENCIES.map((currency) => (
              <th key={currency} className="px-2 py-1 border whitespace-nowrap">{currency}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([date, rates]) => (
            <tr key={date} className="border-t">
              <td className="px-2 py-1 border font-medium">{date}</td>
              {CURRENCIES.map((currency) => (
                <td key={currency} className="px-2 py-1 border text-right">
                  {rates[currency] ? rates[currency].toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Currency Key</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-sm text-gray-700">
          {[
            ['USD', 'United States Dollar'],
            ['EUR', 'Euro'],
            ['GBP', 'British Pound'],
            ['KES', 'Kenyan Shilling'],
            ['JPY', 'Japanese Yen'],
            ['AUD', 'Australian Dollar'],
            ['CAD', 'Canadian Dollar'],
            ['CNY', 'Chinese Yuan'],
            ['INR', 'Indian Rupee'],
            ['ZAR', 'South African Rand'],
            ['NGN', 'Nigerian Naira'],
            ['CHF', 'Swiss Franc'],
            ['BRL', 'Brazilian Real'],
            ['MXN', 'Mexican Peso'],
            ['SEK', 'Swedish Krona'],
            ['SGD', 'Singapore Dollar'],
            ['NOK', 'Norwegian Krone'],
            ['NZD', 'New Zealand Dollar'],
            ['KRW', 'South Korean Won'],
            ['RUB', 'Russian Ruble'],
          ].map(([code, name]) => (
            <div
              key={code}
              className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1 shadow-sm bg-white"
            >
              <span className="font-semibold">{code}</span>
              <span className="text-xs text-gray-500">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 mx-auto" style={{ width: '320px', height: '200px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CurrencyTable;
