"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import {
  Menu,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  FileText,
} from "lucide-react";

interface Template {
  _id: string;
  itemNo: string;
  description: string;
  unit: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlackWoTemp() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemNo: "",
    description: "",
    unit: "",
    unitPrice: "",
  });
  const [allEntries, setAllEntries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
    fetchAllEntries();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/black-wo-temp");
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const result = await response.json();
      if (result.success) {
        setAllEntries(result.data);
      }
    } catch (error) {
      console.error("Error fetching all entries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/black-wo-temp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Template created successfully!");
        setFormData({ itemNo: "", description: "", unit: "", unitPrice: "" });
        fetchTemplates();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template. Please try again.");
    }
  };

  const handleEdit = (template: Template) => {
    setIsEditing(true);
    setEditingId(template._id);
    setFormData({
      itemNo: template.itemNo,
      description: template.description,
      unit: template.unit,
      unitPrice: template.unitPrice.toString(),
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const response = await fetch("/api/black-wo-temp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Template updated successfully!");
        setIsEditing(false);
        setEditingId(null);
        setFormData({ itemNo: "", description: "", unit: "", unitPrice: "" });
        fetchTemplates();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/black-wo-temp?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setTemplates(templates.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

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
              <SheetContent side="left" className="w-72 p-0 bg-black border-yellow-500/20">
                <Sidebar
                  currentPath="/black-wo-temp"
                  entries={allEntries}
                />
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
            <Sidebar
              currentPath="/black-wo-temp"
              entries={allEntries}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <div className="w-full">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white">
                    Black WO Templates
                  </h2>
                </div>
                <p className="text-sm md:text-base text-gray-400 font-bold">
                  Manage item templates for auto-filling in Blank WO pages
                </p>
              </div>

              {/* Add New Template Form */}
              <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl mb-8">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-black text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-yellow-500" />
                    {isEditing ? "Edit Template" : "Add New Template"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemNo" className="text-white font-bold">Item No.</Label>
                        <Input
                          id="itemNo"
                          type="text"
                          value={formData.itemNo}
                          onChange={(e) => setFormData({ ...formData, itemNo: e.target.value })}
                          placeholder="e.g., 001"
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white font-bold">Description</Label>
                        <Input
                          id="description"
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Item description"
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-white font-bold">Unit</Label>
                        <Input
                          id="unit"
                          type="text"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="e.g., pcs, kg, hrs"
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitPrice" className="text-white font-bold">Unit Price</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          value={formData.unitPrice}
                          onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-xl"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Update" : "Save"} Template
                      </Button>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({ itemNo: "", description: "", unit: "", unitPrice: "" });
                          }}
                          className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-bold"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Templates Table */}
              <Card className="border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-black text-white">
                    All Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-white/20 border-t-white"></div>
                      <p className="text-white mt-4 font-bold">Loading templates...</p>
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                      </div>
                      <p className="text-white mb-6 text-lg font-bold">
                        No templates yet. Create your first template!
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider">
                              Item No.
                            </th>
                            <th className="px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider">
                              Unit
                            </th>
                            <th className="px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs md:text-sm font-black text-white uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {templates.map((template) => (
                            <tr
                              key={template._id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-4 py-3 text-white font-bold">
                                {template.itemNo}
                              </td>
                              <td className="px-4 py-3 text-white font-bold">
                                {template.description}
                              </td>
                              <td className="px-4 py-3 text-white">
                                {template.unit}
                              </td>
                              <td className="px-4 py-3 text-yellow-500 font-black">
                                ${template.unitPrice.toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(template)}
                                    className="text-blue-500 hover:bg-blue-500/10 hover:scale-110 transition-all"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(template._id)}
                                    className="text-red-500 hover:bg-red-500/10 hover:scale-110 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
