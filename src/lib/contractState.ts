"use client";

import { useState, useEffect } from "react";

const CONTRACT_STORAGE_KEY = "selectedContract";

export function useContractState() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);

  // Fetch contracts and load selected contract from localStorage
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        // Initialize default contracts if needed
        await fetch("/api/init-contracts", { method: "POST" });

        // Fetch all contracts
        const response = await fetch("/api/contracts");
        const result = await response.json();
        if (result.success) {
          setContracts(result.data);

          // Load contract from localStorage
          const stored = localStorage.getItem(CONTRACT_STORAGE_KEY);

          if (stored) {
            // Verify the stored contract still exists
            const contractExists = result.data.some((c: any) => c.id === stored);
            if (contractExists) {
              setSelectedContract(stored);
            } else if (result.data.length > 0) {
              // If stored contract doesn't exist, use first contract
              setSelectedContract(result.data[0].id);
            }
          } else if (result.data.length > 0) {
            // No stored contract, use first contract (Contract 1) as default
            setSelectedContract(result.data[0].id);
            localStorage.setItem(CONTRACT_STORAGE_KEY, result.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
      setIsInitialized(true);
    };

    initializeContracts();
  }, []);

  // Save to localStorage whenever contract changes
  useEffect(() => {
    if (isInitialized && selectedContract) {
      localStorage.setItem(CONTRACT_STORAGE_KEY, selectedContract);
    }
  }, [selectedContract, isInitialized]);

  const handleContractChange = (contractId: string | null) => {
    setSelectedContract(contractId);
    if (contractId) {
      localStorage.setItem(CONTRACT_STORAGE_KEY, contractId);
    } else {
      localStorage.removeItem(CONTRACT_STORAGE_KEY);
    }
  };

  return {
    selectedContract,
    setSelectedContract: handleContractChange,
    contracts,
    isInitialized,
  };
}

export function clearContractState() {
  localStorage.removeItem(CONTRACT_STORAGE_KEY);
}

