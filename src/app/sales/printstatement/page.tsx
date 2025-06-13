'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext,
} from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SaleType = 'Sales Entry' | 'Sales Quotation' | 'Direct Sale';

type LogData = {
  id: string;
  customerName: string;
  branchName: string;
  refNo: string;
  creditLimit: string;
  allowedDiscount: string;
  paymentTerms: string;
  preferedPaymentMethod: string;
  salesType: string;
  phone1: string;
  email: string;
  customerId: string;
  kraPin: string;
  deliveryDetails: {
    deliveryFrom: string;
    dueDate: string;
    vehicle: string;
    driver: string;
    trip: string;
    accompaniedBy: string;
    address: string;
    phoneNumber: string;
    customerReference: string;
    comment: string;
    destination: string;
    offload: boolean;
    prepay: boolean;
    itemData: {
      code: string;
      name: string;
      description: string;
      unitOfMeasure: string;
      itemPrice: number;
      discountWholesale: number;
      taxAmount: number;
    }[];
  };
};

type SaleRecord = {
  id: string;
  customerName: string;
  totalAmount: number;
  saleType: SaleType;
  date: string;
  createdAt: string;
  refNo: string;
  branchName: string;
};

const SalesViewerPage = () => {
  const [salesType, setSalesType] = useState<SaleType>('Sales Entry');
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [filteredData, setFilteredData] = useState<SaleRecord[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'customerName' | 'totalAmount' | 'date' | 'refNo'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<LogData[]>('/api/auth/direct-sales');
      const transformedData: SaleRecord[] = response.data.map((item) => ({
        id: item.id,
        customerName: item.customerName,
        totalAmount: item.deliveryDetails.itemData.reduce(
          (sum, item) => sum + item.itemPrice - item.discountWholesale + item.taxAmount,
          0
        ),
        saleType: item.salesType as SaleType,
        date: item.deliveryDetails.dueDate,
        createdAt: new Date().toISOString(),
        refNo: item.refNo,
        branchName: item.branchName,
      }));
      setSalesData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...salesData].filter((sale) => sale.saleType === salesType);

    if (startDate && endDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [salesType, salesData, startDate, endDate, sortBy, sortDirection]);

  const handleSalesTypeChange = (type: SaleType) => setSalesType(type);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-4 justify-between items-end">
            <div className="flex gap-2">
              {(['Sales Entry', 'Sales Quotation', 'Direct Sale'] as SaleType[]).map((type) => (
                <Button
                  key={type}
                  variant={salesType === type ? 'default' : 'outline'}
                  onClick={() => handleSalesTypeChange(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('customerName')} className="cursor-pointer">
                    Customer Name {sortBy === 'customerName' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('totalAmount')} className="cursor-pointer">
                    Total Amount {sortBy === 'totalAmount' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                    Date {sortBy === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('refNo')} className="cursor-pointer">
                    Reference No {sortBy === 'refNo' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>KES {sale.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(sale.date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{sale.refNo}</TableCell>
                      <TableCell>{sale.branchName}</TableCell>
                      <TableCell>{sale.saleType}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No sales data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="flex justify-end space-x-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                    className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>
                <PaginationItem>
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages && setCurrentPage((prev) => prev + 1)
                    }
                    className={cn(currentPage === totalPages && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesViewerPage;