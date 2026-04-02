"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Menu,
  FileText,
  BarChart3,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  Download,
  Printer,
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
  title?: string;
  blankWoId?: number;
}

export default function MasterInvoice() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const result = await response.json();

      if (result.success) {
        setEntries(result.data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate master totals
  const masterTotals = entries.reduce(
    (acc, entry) => ({
      totalQuantity: acc.totalQuantity + (entry.totals?.quantity || 0),
      totalValue: acc.totalValue + (entry.totals?.totalValue || 0),
      totalItems: acc.totalItems + entry.entries.length,
    }),
    { totalQuantity: 0, totalValue: 0, totalItems: 0 }
  );

  // Group entries by month
  const entriesByMonth = entries.reduce((acc, entry) => {
    const month = new Date(entry.headerData.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, current: false },
    { href: "/blank-wo/1", label: "Blank WO 1", icon: FileText, current: false },
    { href: "/blank-wo/2", label: "Blank WO 2", icon: FileText, current: false },
    { href: "/blank-wo/3", label: "Blank WO 3", icon: FileText, current: false },
    { href: "/blank-wo/4", label: "Blank WO 4", icon: FileText, current: false },
    { href: "/master-invoice", label: "Master Invoice", icon: BarChart3, current: true },
  ];

  const Sidebar = () => (
    <aside className="w-full md:w-72 border-r border-white/10 bg-black/95 backdrop-blur-xl min-h-screen">
      <div className="p-6 md:p-8">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl md:text-3xl font-black text-white cursor-pointer">
            Tracker
          </h1>
        </Link>
        <p className="text-sm text-gray-400 mt-2 font-bold">
          Work Order Management
        </p>
      </div>

      <nav className="mt-6 md:mt-8 px-3 md:px-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3 hidden md:block">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl mb-2 transition-all duration-300 group ${
                item.current
                  ? "bg-yellow-500 text-black font-black shadow-lg shadow-yellow-500/20 scale-105"
                  : "text-gray-400 hover:bg-white/5 hover:text-white hover:scale-102"
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              <span className="font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <Sheet>
              <SheetTrigger>
                <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-black border-white/10">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <Link href="/" className="inline-block">
              <h1 className="text-xl font-black text-white">
                Tracker
              </h1>
            </Link>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <div className="w-full">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-black" />
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
                      onClick={fetchEntries}
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

              {/* Master Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
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
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Items
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-white mt-2">
                          {loading ? "..." : masterTotals.totalItems}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
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
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
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
              <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-black text-white">
                    All Work Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-white/20 border-t-white"></div>
                      <p className="text-white mt-4 font-bold">Loading invoice data...</p>
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                      </div>
                      <p className="text-white mb-6 text-lg font-bold">
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
                          <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white font-black">Date</TableHead>
                            <TableHead className="text-white font-black">WO No.</TableHead>
                            <TableHead className="text-white font-black hidden md:table-cell">Asset No.</TableHead>
                            <TableHead className="text-white font-black hidden md:table-cell">Contractor</TableHead>
                            <TableHead className="text-white font-black">Items</TableHead>
                            <TableHead className="text-white font-black">Quantity</TableHead>
                            <TableHead className="text-white font-black">Total Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.map((entry) => (
                            <TableRow
                              key={entry._id}
                              className="border-white/10 hover:bg-yellow-500/5 transition-colors"
                            >
                              <TableCell className="text-white font-bold">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500 hidden sm:block" />
                                  {new Date(entry.headerData.date).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {entry.headerData.workOrder || (
                                  <span className="text-gray-600">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white font-bold hidden md:table-cell">
                                {entry.headerData.assetNo || (
                                  <span className="text-gray-600">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white font-bold hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  {entry.headerData.contractor || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-white">
                                <Badge className="bg-white/10 text-white border-white/20 font-bold">
                                  {entry.entries.length}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {entry.totals.quantity}
                              </TableCell>
                              <TableCell className="text-yellow-500 font-black">
                                ${entry.totals.totalValue.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Grand Total Row */}
                          <TableRow className="border-t-2 border-yellow-500 bg-yellow-500/10">
                            <TableCell
                              colSpan={4}
                              className="text-white text-sm md:text-base font-black"
                            >
                              GRAND TOTAL
                            </TableCell>
                            <TableCell className="text-white font-black">
                              {masterTotals.totalItems}
                            </TableCell>
                            <TableCell className="text-white font-black">
                              {masterTotals.totalQuantity}
                            </TableCell>
                            <TableCell className="text-yellow-500 font-black text-lg">
                              ${masterTotals.totalValue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              {Object.keys(entriesByMonth).length > 0 && (
                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-black text-white">
                      Monthly Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(entriesByMonth).map(([month, monthEntries]) => {
                        const monthTotal = monthEntries.reduce(
                          (sum, entry) => sum + entry.totals.totalValue,
                          0
                        );
                        const monthQuantity = monthEntries.reduce(
                          (sum, entry) => sum + entry.totals.quantity,
                          0
                        );
                        return (
                          <div
                            key={month}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-yellow-500" />
                              <div>
                                <p className="text-white font-black">{month}</p>
                                <p className="text-sm text-gray-500 font-bold">
                                  {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-500 font-black text-lg">
                                ${monthTotal.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 font-bold">
                                {monthQuantity} items
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
