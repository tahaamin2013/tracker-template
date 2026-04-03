"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FileEdit,
  Building2,
  ChevronDown,
  Plus,
  Home,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getBlankWoPages } from "@/lib/blankWoStorage";

interface SidebarProps {
  currentPath: string;
  entries?: any[];
}

export function Sidebar({
  currentPath,
  entries = [],
}: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const contractId = params?.contractId as string;
  const [contracts, setContracts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContractName, setNewContractName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch contracts
  useState(() => {
    const initializeAndFetchContracts = async () => {
      try {
        await fetch("/api/init-contracts", { method: "POST" });
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }

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

    initializeAndFetchContracts();
  });

  const handleCreateContract = async () => {
    if (!newContractName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newContractName }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Contract created! Redirecting to new contract...");
        router.push(`/${result.data.id}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract");
    } finally {
      setIsCreating(false);
    }
  };

  const handleContractChange = (newContractId: string | null) => {
    if (newContractId) {
      router.push(`/${newContractId}`);
    } else {
      router.push("/");
    }
  };

  // Get dynamic Blank WO pages - filtered by current contract
  const entriesForContract = (entries || []).filter((e) => {
    if (!contractId) return true;
    return e.contractId === contractId;
  });

  const blankWoPagesFromEntries = entriesForContract
    .filter((e) => e.blankWoId)
    .map((e) => e.blankWoId)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  // Extract current blankWoId from URL if we're on a blank-wo page
  let currentBlankWoId: number | null = null;
  if (currentPath?.includes('/blank-wo/')) {
    const match = currentPath.match(/\/blank-wo\/(\d+)/);
    if (match) {
      currentBlankWoId = parseInt(match[1]);
    }
  }

  // Get saved Blank WO pages from localStorage
  const savedBlankWoPages = contractId ? getBlankWoPages(contractId) : [];

  // Combine all sources: entries, current page, and saved pages
  const allBlankWoPages = [...blankWoPagesFromEntries];
  if (currentBlankWoId && !allBlankWoPages.includes(currentBlankWoId)) {
    allBlankWoPages.push(currentBlankWoId);
    // Save current page to localStorage
    if (contractId && currentBlankWoId) {
      import('@/lib/blankWoStorage').then(({ saveBlankWoPage }) => {
        saveBlankWoPage(contractId, currentBlankWoId);
      });
    }
  }

  // Add saved pages
  savedBlankWoPages.forEach(id => {
    if (!allBlankWoPages.includes(id)) {
      allBlankWoPages.push(id);
    }
  });

  allBlankWoPages.sort((a, b) => a - b);

  const maxBlankWo = Math.max(...allBlankWoPages, 4);

  const menuItems = [
    { href: contractId ? `/${contractId}` : "/", label: "Dashboard", icon: LayoutDashboard },
    ...Array.from({ length: maxBlankWo }, (_, i) => ({
      href: contractId ? `/${contractId}/blank-wo/${i + 1}` : `/blank-wo/${i + 1}`,
      label: `Blank WO ${i + 1}`,
      icon: FileText,
    })),
    { href: contractId ? `/${contractId}/master-invoice` : "/master-invoice", label: "Master Invoice", icon: BarChart3 },
    { href: contractId ? `/${contractId}/black-wo-temp` : "/black-wo-temp", label: "Black WO Temp", icon: FileEdit },
  ];

  return (
    <aside className="w-full md:w-72 border-r border-white/10 bg-black/95 backdrop-blur-xl min-h-screen overflow-y-auto flex flex-col">
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

      {/* Contracts Dropdown */}
      <div className="px-4 md:px-6 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/20 text-white hover:bg-white/10 rounded-lg font-bold transition-colors">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-yellow-500" />
                {contractId
                  ? (contracts.find((c) => c.id === contractId)?.name || "All Contracts")
                  : "Select Contract"}
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black border-white/20"
          >
            <DropdownMenuItem
              onClick={() => handleContractChange(null)}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              <Home className="w-4 h-4 mr-2" />
              All Contracts
            </DropdownMenuItem>
            {contracts.map((contract) => (
              <DropdownMenuItem
                key={contract.id}
                onClick={() => handleContractChange(contract.id)}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                {contract.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}
              className="text-yellow-500 hover:bg-white/10 cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="mt-4 md:mt-6 px-3 md:px-4 flex-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3 hidden md:block">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || currentPath?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl mb-2 transition-all duration-300 group ${
                isActive
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

      {/* Create Blank WO Button - At bottom */}
      <div className="p-4 md:p-6 border-t border-white/10">
        <Button
          variant="outline"
          className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold"
          onClick={() => {
            const id = prompt("Enter Blank WO number (e.g., 5, 6, 7):");
            if (id && !isNaN(Number(id)) && contractId) {
              router.push(`/${contractId}/blank-wo/${id}`);
            } else if (id) {
              alert("Please select a contract first");
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2 text-yellow-500" />
          New Blank WO
        </Button>
      </div>

      {/* Create Contract Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Contract</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a name for the new contract
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contractName" className="text-white">Contract Name</Label>
              <Input
                id="contractName"
                value={newContractName}
                onChange={(e) => setNewContractName(e.target.value)}
                placeholder="e.g., Contract 4"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-yellow-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) {
                    handleCreateContract();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewContractName("");
              }}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-bold"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateContract}
              disabled={!newContractName.trim() || isCreating}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              {isCreating ? "Creating..." : "Create Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
