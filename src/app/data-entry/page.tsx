"use client";

import { useState } from "react";
import Link from "next/link";

interface Entry {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  measurements: string;
}

interface HeaderData {
  date: string;
  workOrder: string;
  assetNo: string;
  contractor: string;
}

export default function DataEntry() {
  const [headerData, setHeaderData] = useState<HeaderData>({
    date: new Date().toISOString().split("T")[0],
    workOrder: "",
    assetNo: "",
    contractor: "",
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
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (
    id: string,
    field: keyof Entry,
    value: string | number
  ) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          const updated = { ...entry, [field]: value };
          // Calculate total value when quantity or unit price changes
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
    setSaveSuccess(false);

    try {
      const payload = {
        headerData,
        entries,
        totals,
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
        setSaveSuccess(true);
        alert("Entry saved successfully!");

        // Reset form after saving
        setHeaderData({
          date: new Date().toISOString().split("T")[0],
          workOrder: "",
          assetNo: "",
          contractor: "",
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
          },
        ]);

        setTimeout(() => setSaveSuccess(false), 3000);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                📦 Tracker
              </h1>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Work Order Management
            </p>
          </div>

          <nav className="mt-6 px-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/data-entry"
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
            >
              <span className="text-xl">📝</span>
              <span>Data Entry</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                  Data Entry
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Create and manage work order entries
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Header Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={headerData.date}
                      onChange={(e) =>
                        setHeaderData({ ...headerData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Work Order (WO)
                    </label>
                    <input
                      type="text"
                      value={headerData.workOrder}
                      onChange={(e) =>
                        setHeaderData({
                          ...headerData,
                          workOrder: e.target.value,
                        })
                      }
                      placeholder="Enter WO number"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Asset No.
                    </label>
                    <input
                      type="text"
                      value={headerData.assetNo}
                      onChange={(e) =>
                        setHeaderData({ ...headerData, assetNo: e.target.value })
                      }
                      placeholder="Enter asset number"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contractor
                    </label>
                    <input
                      type="text"
                      value={headerData.contractor}
                      onChange={(e) =>
                        setHeaderData({
                          ...headerData,
                          contractor: e.target.value,
                        })
                      }
                      placeholder="Enter contractor name"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Data Table Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Line Items
                  </h3>
                  <button
                    type="button"
                    onClick={addEntry}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>➕</span>
                    Add Row
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Item No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Measurements
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-20">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                      {entries.map((entry, index) => (
                        <tr
                          key={entry.id}
                          className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={entry.itemNo}
                              onChange={(e) =>
                                updateEntry(entry.id, "itemNo", e.target.value)
                              }
                              placeholder={`#${index + 1}`}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={entry.description}
                              onChange={(e) =>
                                updateEntry(
                                  entry.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Item description"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={entry.unit}
                              onChange={(e) =>
                                updateEntry(entry.id, "unit", e.target.value)
                              }
                              placeholder="pcs, kg, etc."
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
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
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
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
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="px-3 py-2 bg-slate-50 dark:bg-gray-600 rounded-lg text-sm font-medium text-slate-800 dark:text-white">
                              ${entry.totalValue.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={entry.measurements}
                              onChange={(e) =>
                                updateEntry(
                                  entry.id,
                                  "measurements",
                                  e.target.value
                                )
                              }
                              placeholder="Dimensions, etc."
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeEntry(entry.id)}
                              disabled={entries.length === 1}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Remove row"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold">
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-slate-700 dark:text-slate-300"
                        >
                          Totals:
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">
                          {totals.quantity}
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">
                          -
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">
                          ${totals.totalValue.toFixed(2)}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-800 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    "💾 Save Entry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
