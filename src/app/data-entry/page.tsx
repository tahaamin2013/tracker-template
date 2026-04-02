"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const menuItems = [
    { href: "/", label: "Dashboard", icon: "📊", current: false },
    { href: "/data-entry", label: "Data Entry", icon: "📝", current: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-screen">
          <div className="p-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors">
                📦 Tracker
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
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
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Data Entry
              </h2>
              <p className="text-muted-foreground mt-2">
                Create and manage work order entries
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Header Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={headerData.date}
                        onChange={(e) =>
                          setHeaderData({ ...headerData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workOrder">Work Order (WO)</Label>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assetNo">Asset No.</Label>
                      <Input
                        id="assetNo"
                        type="text"
                        value={headerData.assetNo}
                        onChange={(e) =>
                          setHeaderData({ ...headerData, assetNo: e.target.value })
                        }
                        placeholder="Enter asset number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractor">Contractor</Label>
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
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Table Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Line Items</CardTitle>
                    <Button
                      type="button"
                      onClick={addEntry}
                      variant="outline"
                    >
                      <span className="mr-2">➕</span>
                      Add Row
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Item No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Unit
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Total Value
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                            Measurements
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-20">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, index) => (
                          <tr
                            key={entry.id}
                            className="border-b border-border hover:bg-accent/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <Input
                                type="text"
                                value={entry.itemNo}
                                onChange={(e) =>
                                  updateEntry(entry.id, "itemNo", e.target.value)
                                }
                                placeholder={`#${index + 1}`}
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
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
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="text"
                                value={entry.unit}
                                onChange={(e) =>
                                  updateEntry(entry.id, "unit", e.target.value)
                                }
                                placeholder="pcs, kg, etc."
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
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
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
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
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="px-3 py-2 bg-muted rounded-lg text-sm font-medium text-foreground">
                                ${entry.totalValue.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
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
                                placeholder="Dimensions, etc."
                                className="bg-background"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEntry(entry.id)}
                                disabled={entries.length === 1}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove row"
                              >
                                🗑️
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/50 font-semibold">
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-foreground"
                          >
                            Totals:
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {totals.quantity}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            -
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            ${totals.totalValue.toFixed(2)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
