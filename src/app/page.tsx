"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  LayoutDashboard,
  FileText,
  BarChart3,
  DollarSign,
  Package,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
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

export default function Dashboard() {
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

  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setEntries(entries.filter((entry) => entry._id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, current: true },
    { href: "/blank-wo/1", label: "Blank WO 1", icon: FileText, current: false },
    { href: "/blank-wo/2", label: "Blank WO 2", icon: FileText, current: false },
    { href: "/blank-wo/3", label: "Blank WO 3", icon: FileText, current: false },
    { href: "/blank-wo/4", label: "Blank WO 4", icon: FileText, current: false },
    { href: "/master-invoice", label: "Master Invoice", icon: BarChart3, current: false },
  ];

  // Calculate stats
  const totalEntries = entries.length;
  const totalQuantity = entries.reduce(
    (sum, entry) => sum + (entry.totals?.quantity || 0),
    0
  );
  const totalValue = entries.reduce(
    (sum, entry) => sum + (entry.totals?.totalValue || 0),
    0
  );

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
                  ? "bg-white text-black font-black shadow-lg shadow-white/20 scale-105"
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

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
              <div className="mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 font-bold">
                      Manage your work orders and track inventory items
                    </p>
                  </div>
                  <Link href="/blank-wo/1" className="hidden sm:block">
                    <Button
                      size="lg"
                      className="bg-white hover:bg-gray-200 text-black font-black shadow-2xl hover:scale-105 transition-all"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      New Entry
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Entries
                        </p>
                        <p className="text-3xl md:text-5xl font-black text-white mt-2">
                          {loading ? "..." : totalEntries}
                        </p>
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Items
                        </p>
                        <p className="text-3xl md:text-5xl font-black text-white mt-2">
                          {loading ? "..." : totalQuantity}
                        </p>
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Value
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-white mt-2">
                          {loading ? "..." : `$${totalValue.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Quick Actions */}
              <div className="md:hidden mb-8">
                <Link href="/blank-wo/1" className="block">
                  <Card className="border border-white/10 bg-white text-black shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-wider">
                            Quick Action
                          </p>
                          <p className="text-xl font-black mt-1 flex items-center">
                            <Plus className="mr-2 h-5 w-5" />
                            New Entry
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Recent Entries */}
              <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl md:text-2xl font-black text-white">
                      Recent Entries
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchEntries}
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-white/20 border-t-white"></div>
                      <p className="text-white mt-4 font-bold">Loading entries...</p>
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
                        <Button
                          size="lg"
                          className="bg-white hover:bg-gray-200 text-black font-bold shadow-xl"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Create First Entry
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white font-bold">Date</TableHead>
                            <TableHead className="text-white font-bold">Work Order</TableHead>
                            <TableHead className="text-white font-bold hidden md:table-cell">Contractor</TableHead>
                            <TableHead className="text-white font-bold">Items</TableHead>
                            <TableHead className="text-white font-bold">Total Value</TableHead>
                            <TableHead className="text-white font-bold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.slice(0, 10).map((entry) => (
                            <TableRow
                              key={entry._id}
                              className="border-white/10 hover:bg-white/5 transition-colors"
                            >
                              <TableCell className="text-white font-bold">
                                {new Date(entry.headerData.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-white font-bold">
                                {entry.headerData.workOrder || (
                                  <span className="text-gray-600">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white font-bold hidden md:table-cell">
                                {entry.headerData.contractor || (
                                  <span className="text-gray-600">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white">
                                <Badge className="bg-white text-black border-0 font-bold">
                                  {entry.entries.length}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white font-black">
                                ${entry.totals.totalValue.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-white text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link href={`/blank-wo/1?id=${entry._id}`}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-white hover:bg-white/10 hover:scale-110 transition-all"
                                      title="View"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteEntry(entry._id)}
                                    className="text-red-500 hover:bg-red-500/10 hover:scale-110 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
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
