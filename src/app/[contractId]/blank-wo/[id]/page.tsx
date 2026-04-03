"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { DescriptionSelector } from "@/components/DescriptionSelector";
import {
  Menu,
  Save,
  X,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";

interface Entry {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  measurements: string;
  checked?: boolean;
}

interface HeaderData {
  date: string;
  workOrder: string;
  assetNo: string;
  contractor: string;
  address: string;
  sawsInspector: string;
}

interface Template {
  _id: string;
  itemNo: string;
  description: string;
  unit: string;
  unitPrice: number;
}

export default function BlankWOPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const contractId = params.contractId as string;
  const id = params.id as string || "1";
  const [allEntries, setAllEntries] = useState<any[]>([]);

  const [headerData, setHeaderData] = useState<HeaderData>({
    date: new Date().toISOString().split("T")[0],
    workOrder: "",
    assetNo: "",
    contractor: "",
    address: "",
    sawsInspector: "",
  });

  const [entries, setEntries] = useState<Entry[]>([
    {
      id: "1",
      itemNo: "",
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      measurements: "",
      checked: false,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAllEntries();

    const entryId = searchParams.get("id");
    if (entryId) {
      fetchEntry(entryId);
    }
  }, []);

  const fetchAllEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const result = await response.json();
      if (result.success) {
        setAllEntries(result.data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setHeaderData({
          date: data.headerData.date,
          workOrder: data.headerData.workOrder,
          assetNo: data.headerData.assetNo,
          contractor: data.headerData.contractor,
          address: data.headerData.address || "",
          sawsInspector: data.headerData.sawsInspector || "",
        });
        setEntries(data.entries);
      }
    } catch (error) {
      console.error("Error fetching entry:", error);
    }
  };

  const addEntry = () => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      itemNo: "",
      description: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      measurements: "",
      checked: false,
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (entryId: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== entryId));
    }
  };

  const updateEntry = (
    entryId: string,
    field: keyof Entry,
    value: string | number | boolean
  ) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === entryId) {
          const updated = { ...entry, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.totalValue =
              Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return entry;
      })
    );
  };

  const handleTemplateSelect = (entryId: string, template: Template) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === entryId) {
          return {
            ...entry,
            itemNo: template.itemNo,
            description: template.description,
            unit: template.unit,
            unitPrice: template.unitPrice,
            totalValue: Number(entry.quantity) * template.unitPrice,
          };
        }
        return entry;
      })
    );
  };

  const calculateTotals = () => {
    return entries.reduce(
      (acc, entry) => ({
        quantity: acc.quantity + (Number(entry.quantity) || 0),
        totalValue: acc.totalValue + (Number(entry.totalValue) || 0),
      }),
      { quantity: 0, totalValue: 0 }
    );
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        title: `Blank WO ${id}`,
        blankWoId: parseInt(id),
        headerData,
        entries,
        totals,
        contractId: contractId,
      };

      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("Entry saved successfully!");

        setHeaderData({
          date: new Date().toISOString().split("T")[0],
          workOrder: "",
          assetNo: "",
          contractor: "",
          address: "",
          sawsInspector: "",
        });
        setEntries([
          {
            id: Date.now().toString(),
            itemNo: "",
            description: "",
            unit: "",
            quantity: 0,
            unitPrice: 0,
            totalValue: 0,
            measurements: "",
            checked: false,
          },
        ]);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
        <div className="md:hidden sticky top-0 z-50 border-b border-white/20 bg-black/95 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <Sheet>
              <SheetTrigger>
                <button className="text-yellow-500 p-2 hover:bg-yellow-500/10 rounded-lg transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-black border-white/20"
              >
                <Sidebar
                  currentPath={`/blank-wo/${id}`}
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
              currentPath={`/${contractId}/blank-wo/${id}`}
              entries={allEntries}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <div className="w-full max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white">
                    Blank WO {id}
                  </h2>
                </div>
                <p className="text-sm md:text-base text-gray-400 font-bold">
                  Create and manage work order entries
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section */}
                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl font-black text-white">
                      Header Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-white font-bold">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={headerData.date}
                          onChange={(e) =>
                            setHeaderData({ ...headerData, date: e.target.value })
                          }
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workOrder" className="text-white font-bold">
                          Work Order (WO)
                        </Label>
                        <Input
                          id="workOrder"
                          type="text"
                          value={headerData.workOrder}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              workOrder: e.target.value,
                            })
                          }
                          placeholder="Enter WO number"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assetNo" className="text-white font-bold">
                          Asset No.
                        </Label>
                        <Input
                          id="assetNo"
                          type="text"
                          value={headerData.assetNo}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              assetNo: e.target.value,
                            })
                          }
                          placeholder="Enter asset number"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contractor" className="text-white font-bold">
                          Contractor
                        </Label>
                        <Input
                          id="contractor"
                          type="text"
                          value={headerData.contractor}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              contractor: e.target.value,
                            })
                          }
                          placeholder="Enter contractor name"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-white font-bold">
                          Address
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          value={headerData.address}
                          onChange={(e) =>
                            setHeaderData({ ...headerData, address: e.target.value })
                          }
                          placeholder="Enter address"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sawsInspector" className="text-white font-bold">
                          SAWS Inspector
                        </Label>
                        <Input
                          id="sawsInspector"
                          type="text"
                          value={headerData.sawsInspector}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              sawsInspector: e.target.value,
                            })
                          }
                          placeholder="Enter inspector name"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Table Section */}
                <Card className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="text-lg md:text-xl font-black text-white">
                        Line Items
                      </CardTitle>
                      <Button
                        type="button"
                        onClick={addEntry}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold shadow-xl w-full sm:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4 text-yellow-500" />
                        Add Row
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                      <div className="inline-block min-w-full align-middle px-4 md:px-0">
                        <table className="min-w-full divide-y divide-yellow-500/20">
                          <thead>
                            <tr>
                              {[
                                "Item No.",
                                "Description",
                                "Unit",
                                "Quantity",
                                "Unit Price",
                                "Total Value",
                                "Measurements",
                                "Checked",
                                "Actions",
                              ].map((header) => (
                                <th
                                  key={header}
                                  className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider whitespace-nowrap"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-yellow-500/20">
                            {entries.map((entry, index) => (
                              <tr
                                key={entry.id}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    value={entry.itemNo}
                                    onChange={(e) =>
                                      updateEntry(entry.id, "itemNo", e.target.value)
                                    }
                                    placeholder={`#${index + 1}`}
                                    className="bg-white/5 border-yellow-500/30 text-white placeholder:text-white/40 text-sm"
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 min-w-48">
                                  <DescriptionSelector
                                    value={entry.description}
                                    onChange={(value) =>
                                      updateEntry(entry.id, "description", value)
                                    }
                                    onSelectTemplate={(template) =>
                                      handleTemplateSelect(entry.id, template)
                                    }
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <Input
                                    type="text"
                                    value={entry.unit}
                                    onChange={(e) =>
                                      updateEntry(entry.id, "unit", e.target.value)
                                    }
                                    placeholder="pcs, kg"
                                    className="bg-white/5 border-yellow-500/30 text-white placeholder:text-white/40 text-sm"
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <Input
                                    type="number"
                                    value={entry.quantity || ""}
                                    onChange={(e) =>
                                      updateEntry(
                                        entry.id,
                                        "quantity",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="bg-white/5 border-yellow-500/30 text-white placeholder:text-white/40 text-sm"
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <Input
                                    type="number"
                                    value={entry.unitPrice || ""}
                                    onChange={(e) =>
                                      updateEntry(
                                        entry.id,
                                        "unitPrice",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    placeholder="$0.00"
                                    min="0"
                                    step="0.01"
                                    className="bg-white/5 border-yellow-500/30 text-white placeholder:text-white/40 text-sm"
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm font-black text-yellow-500">
                                    ${entry.totalValue.toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-3 md:px-4 py-3">
                                  <Input
                                    type="text"
                                    value={entry.measurements}
                                    onChange={(e) =>
                                      updateEntry(
                                        entry.id,
                                        "measurements",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Dimensions"
                                    className="bg-white/5 border-yellow-500/30 text-white placeholder:text-white/40 text-sm min-w-25"
                                  />
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={entry.checked}
                                      onChange={(e) =>
                                        updateEntry(entry.id, "checked", e.target.checked)
                                      }
                                      className="w-5 h-5 bg-yellow-500 border-yellow-500/30 rounded cursor-pointer"
                                    />
                                  </div>
                                </td>
                                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEntry(entry.id)}
                                    disabled={entries.length === 1}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 p-0"
                                    title="Remove row"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-yellow-500/10 font-black border-t-2 border-yellow-500/30">
                              <td
                                colSpan={4}
                                className="px-3 md:px-4 py-4 text-white text-sm md:text-base"
                              >
                                Totals:
                              </td>
                              <td className="px-3 md:px-4 py-4 text-white text-sm md:text-base font-black">
                                {totals.quantity}
                              </td>
                              <td className="px-3 md:px-4 py-4 text-white text-sm md:text-base">
                                -
                              </td>
                              <td className="px-3 md:px-4 py-4 text-yellow-500 text-base md:text-lg font-black">
                                ${totals.totalValue.toFixed(2)}
                              </td>
                              <td colSpan={2} />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <Link href={`/${contractId}`} className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto bg-white/5 border-yellow-500/30 text-white hover:bg-white/10 font-bold"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
