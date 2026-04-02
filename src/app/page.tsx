"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    { href: "/", label: "Dashboard", icon: "📊", current: true },
    { href: "/data-entry", label: "Data Entry", icon: "📝", current: false },
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              📦 Tracker
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Work Order Management
            </p>
          </div>

          <nav className="mt-6 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  item.current
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage your work orders and track inventory items
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Entries
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                      {loading ? "..." : totalEntries}
                    </p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Items
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                      {loading ? "..." : totalQuantity}
                    </p>
                  </div>
                  <div className="text-4xl">🔧</div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Value
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                      {loading ? "..." : `$${totalValue.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/data-entry"
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      New Entry
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Create a new work order entry
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Recent Entries
                </h3>
                <button
                  onClick={fetchEntries}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Loading entries...
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p className="mb-4">No entries yet. Create your first entry!</p>
                  <Link
                    href="/data-entry"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Create Entry
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Work Order
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Contractor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                      {entries.slice(0, 10).map((entry) => (
                        <tr
                          key={entry._id}
                          className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-white">
                            {new Date(entry.headerData.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-white">
                            {entry.headerData.workOrder || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-white">
                            {entry.headerData.contractor || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800 dark:text-white">
                            {entry.entries.length}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                            ${entry.totals.totalValue.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/data-entry?id=${entry._id}`}
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title="View"
                              >
                                👁️
                              </Link>
                              <button
                                onClick={() => deleteEntry(entry._id)}
                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
