"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";

interface Contract {
  id: string;
  name: string;
}

export default function RootPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAndFetchContracts = async () => {
      try {
        // Initialize default contracts
        await fetch("/api/init-contracts", { method: "POST" });

        // Fetch all contracts
        const response = await fetch("/api/contracts");
        const result = await response.json();
        if (result.success) {
          setContracts(result.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setLoading(false);
      }
    };

    initializeAndFetchContracts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }


  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 via-transparent to-yellow-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            Tracker
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-bold">
            Work Order Management System
          </p>
        </div>

        {/* Contract Selection */}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Select a Contract
            </h2>
            <p className="text-gray-400">
              Choose a contract to manage its work orders and data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <Card
                key={contract.id}
                className="border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl hover:scale-105 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer group"
                onClick={() => router.push(`/${contract.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                      <Building2 className="w-6 h-6 text-yellow-500" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">
                    {contract.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click to manage this contract
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
