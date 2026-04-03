"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { Sidebar } from "@/components/Sidebar";
import {
  FileText,
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
    address?: string;
    sawsInspector?: string;
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
    checked?: boolean;
  }>;
  totals: {
    quantity: number;
    totalValue: number;
  };
  createdAt: string;
  title?: string;
  blankWoId?: number;
  contractId?: string;
  // New fields
  status?: string;
  comments?: string;
  woCompleted?: boolean;
  restorationDue10Days?: string;
  restorationCompleteDate?: string;
  pendingRestoration?: boolean;
  restorationOver10Days?: boolean;
  notesUploaded?: boolean;
  reparationUploaded?: boolean;
  restorationUploaded?: boolean;
}

export default function ContractDashboard() {
  const params = useParams();
  const contractId = params.contractId as string;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchContracts();
    fetchEntries();
  }, [contractId]);

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts");
      const result = await response.json();
      if (result.success) {
        setContracts(result.data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch(`/api/entries?contractId=${contractId}`);
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 via-transparent to-yellow-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              currentPath={`/${contractId}`}
              entries={entries}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <div className="w-full">
              {/* Header */}
              <div className="mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
                      {contracts.find((c) => c.id === contractId)?.name || `Contract ${contractId}`}
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 font-bold">
                      Manage your work orders and track inventory items
                    </p>
                  </div>
                  <Link href={`/${contractId}/blank-wo/1`} className="hidden sm:block">
                    <Button
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 shadow-2xl hover:scale-105 transition-all"
                    >
                      <Plus className="mr-2 h-5 w-5 text-yellow-500" />
                      New Entry
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
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
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
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
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm font-black text-gray-500 uppercase tracking-wider">
                          Total Value
                        </p>
                        <p className="text-2xl md:text-4xl font-black text-yellow-500 mt-2">
                          {loading ? "..." : `$${totalValue.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Quick Actions */}
              <div className="md:hidden mb-8">
                <Link href={`/${contractId}/blank-wo/1`} className="block">
                  <Card className="border border-white/20 bg-white/5 text-white shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-wider">
                            Quick Action
                          </p>
                          <p className="text-xl font-black mt-1 flex items-center">
                            <Plus className="mr-2 h-5 w-5 text-yellow-500" />
                            New Entry
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Recent Entries */}
              <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl md:text-2xl font-black text-white">
                      All Entries
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
                      <p className="text-white mt-4 font-bold">
                        Loading entries...
                      </p>
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                      </div>
                      <p className="text-white mb-6 text-lg font-bold">
                        No entries yet. Create your first entry!
                      </p>
                      <Link href={`/${contractId}/blank-wo/1`}>
                        <Button
                          size="lg"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl"
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
                          <TableRow className="border-white/20 hover:bg-white/5">
                            <TableHead className="text-white font-bold text-xs">
                              SAWS Inspector
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              WO No.
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Address
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Description
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Status
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs hidden lg:table-cell">
                              Comments
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              WO Completed
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs hidden md:table-cell">
                              Restoration Due
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs hidden md:table-cell">
                              Complete Date
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Pending Restoration
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs hidden lg:table-cell">
                              Over 10 Days
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Notes
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Reparation
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs">
                              Restoration
                            </TableHead>
                            <TableHead className="text-white font-bold text-xs text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.slice(0, 10).map((entry) => {
                            const firstItem = entry.entries[0];
                            return (
                              <TableRow
                                key={entry._id}
                                className="border-white/20 hover:bg-white/5 transition-colors"
                              >
                                <TableCell className="text-white font-bold text-xs">
                                  {entry.headerData.sawsInspector || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white font-bold text-xs">
                                  {entry.headerData.workOrder || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white font-bold text-xs">
                                  {entry.headerData.address || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white font-bold text-xs">
                                  {firstItem?.description || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    entry.status === 'Completed'
                                      ? 'bg-green-500/20 text-green-500'
                                      : entry.status === 'Pending'
                                      ? 'bg-yellow-500/20 text-yellow-500'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {entry.status || 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-white text-xs hidden lg:table-cell">
                                  {entry.comments || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center">
                                  {entry.woCompleted ? (
                                    <span className="text-green-500">✓</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs hidden md:table-cell">
                                  {entry.restorationDue10Days || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs hidden md:table-cell">
                                  {entry.restorationCompleteDate || (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center">
                                  {entry.pendingRestoration ? (
                                    <span className="text-yellow-500">Yes</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center hidden lg:table-cell">
                                  {entry.restorationOver10Days ? (
                                    <span className="text-red-500">Yes</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center">
                                  {entry.notesUploaded ? (
                                    <span className="text-green-500">✓</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center">
                                  {entry.reparationUploaded ? (
                                    <span className="text-green-500">✓</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-xs text-center">
                                  {entry.restorationUploaded ? (
                                    <span className="text-green-500">✓</span>
                                  ) : (
                                    <span className="text-gray-600">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-white text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link href={`/${contractId}/blank-wo/${entry.blankWoId || 1}?id=${entry._id}`}>
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
                            );
                          })}
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
