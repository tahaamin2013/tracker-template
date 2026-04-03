import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Check if contracts already exist
    const existingContracts = await prisma.contract.count();

    if (existingContracts > 0) {
      return NextResponse.json(
        { success: true, message: "Contracts already initialized" },
        { status: 200 }
      );
    }

    // Create default contracts
    const contracts = await Promise.all([
      prisma.contract.create({
        data: { name: "Contract 1" },
      }),
      prisma.contract.create({
        data: { name: "Contract 2" },
      }),
      prisma.contract.create({
        data: { name: "Contract 3" },
      }),
    ]);

    return NextResponse.json(
      { success: true, data: contracts, message: "Contracts initialized successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize contracts" },
      { status: 400 }
    );
  }
}
