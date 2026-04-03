"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { useContractState } from "@/lib/contractState";
import {
  Menu,
  FileText,
  BarChart3,
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  User,
  Building2,
  X,
} from "lucide-react";

interface Entry {
  _id: string;
  headerData: {
    date: string;
    workOrder: string;
    assetNo: string;
    contractor: string;
  };
  entries: Array<{
    id: string;
    itemNo: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    measurements: string;
  }>;
  totals: {
    quantity: number;
    totalValue: number;
  };
  createdAt: string;
}

export default function MasterInvoice() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { selectedContract, isInitialized } = useContractState();

  // Date filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setMounted(true);
    if (isInitialized) {
      fetchAllEntries();
    }
  }, [selectedContract, startDate, endDate, isInitialized]);

  const fetchAllEntries = async () => {
    try {
      const url = selectedContract
        ? `/api/entries?contractId=${selectedContract}`
        : "/api/entries";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setAllEntries(result.data);
      }
    } catch (error) {
      console.error("Error fetching all entries:", error);
    }
  };

  useEffect(() => {
    let filteredEntries = allEntries;

    // Apply date filtering
    if (startDate || endDate) {
      filteredEntries = filteredEntries.filter((entry: Entry) => {
        const entryDate = new Date(entry.headerData.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && entryDate < start) return false;
        if (end && entryDate > end) return false;
        return true;
      });
    }

    setEntries(filteredEntries);
    setLoading(false);
  }, [allEntries, startDate, endDate]);

  // Flatten all line items from all entries
  const allLineItems = entries.flatMap((entry) =>
    entry.entries.map((item, index) => ({
      lineNo: index + 1,
      itemNo: item.itemNo,
      description: item.description,
      unit: item.unit,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalAmount: item.totalValue,
      date: entry.headerData.date,
      workOrder: entry.headerData.workOrder,
      contractor: entry.headerData.contractor,
    }))
  );

  // Calculate master totals
  const masterTotals = allLineItems.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + (Number(item.quantity) || 0),
      totalValue: acc.totalValue + (Number(item.totalAmount) || 0),
      totalItems: acc.totalItems + 1,
    }),
    { totalQuantity: 0, totalValue: 0, totalItems: 0 }
  );

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 via-transparent to-yellow-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-50 border-b border-yellow-500/20 bg-black/95 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <Sheet>
              <SheetTrigger>
                <button className="text-yellow-500 p-2 hover:bg-yellow-500/10 rounded-lg transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-black border-yellow-500/20"
              >
                <Sidebar
                  currentPath="/master-invoice"
                  entries={allEntries}
                />
              </SheetContent>
            </Sheet>
            <Link href="/" className="inline-block">
              <h1 className="text-xl font-black text-yellow-500">Tracker</h1>
            </Link>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              currentPath="/master-invoice"
              entries={allEntries}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <div className="w-full">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black text-white">
                        Master Invoice
                      </h2>
                    </div>
                    <p className="text-sm md:text-base text-gray-400 font-bold">
                      Comprehensive overview of all work orders
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchAllEntries}
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold"
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Date Filter Section */}
              <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-black text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
                    Date Range Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-white font-bold">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-white font-bold">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      {(startDate || endDate) && (
                        <Button
                          variant="outline"
                          onClick={clearDateFilter}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30 font-bold"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear Filter
                        </Button>
                      )}
                    </div>
                  </div>
                  {(startDate || endDate) && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-500 font-bold text-sm">
                        Filtering from {startDate || "the beginning"} to{" "}
                        {endDate || "now"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Master Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Entries
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-white mt-2">
                          {loading ? "..." : entries.length}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Lines
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-white mt-2">
                          {loading ? "..." : masterTotals.totalItems}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Quantity
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-white mt-2">
                          {loading ? "..." : masterTotals.totalQuantity}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Grand Total
                        </p>
                        <p className="text-xl md:text-3xl font-black text-yellow-500 mt-2">
                          {loading ? "..." : `$${masterTotals.totalValue.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-black" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Master Invoice Table */}
              <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-black text-white">
                    All Line Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-yellow-500/20 border-t-yellow-500"></div>
                      <p className="text-yellow-500 mt-4 font-bold">
                        Loading invoice data...
                      </p>
                    </div>
                  ) : allLineItems.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                      </div>
                      <p className="text-yellow-500 mb-6 text-lg font-bold">
                        No entries yet. Create your first entry!
                      </p>
                      <Link href="/blank-wo/1">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl">
                          Create Entry
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/20 hover:bg-white/5">
                            <TableHead className="text-white font-black">
                              Line No.
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Item No.
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Description
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Unit
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Unit Price
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Quantity
                            </TableHead>
                            <TableHead className="text-white font-black">
                              Total Amount
                            </TableHead>
                            <TableHead className="text-white font-black hidden md:table-cell">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allLineItems.map((item, index) => (
                            <TableRow
                              key={`${item.lineNo}-${index}`}
                              className="border-white/20 hover:bg-white/5 transition-colors"
                            >
                              <TableCell className="text-white font-bold">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {item.itemNo || "-"}
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {item.description}
                              </TableCell>
                              <TableCell className="text-white">
                                {item.unit}
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                ${item.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-yellow-500 font-black">
                                ${item.totalAmount.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-white font-bold hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-yellow-500" />
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Grand Total Row */}
                          <TableRow className="border-t-2 border-white/20 bg-white/5">
                            <TableCell
                              colSpan={4}
                              className="text-white text-sm md:text-base font-black"
                            >
                              GRAND TOTAL
                            </TableCell>
                            <TableCell className="text-white font-bold">
                              -
                            </TableCell>
                            <TableCell className="text-white font-black">
                              {masterTotals.totalQuantity}
                            </TableCell>
                            <TableCell className="text-yellow-500 font-black text-lg">
                              ${masterTotals.totalValue.toFixed(2)}
                            </TableCell>
                            <TableCell colSpan={1} className="hidden md:table-cell" />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
