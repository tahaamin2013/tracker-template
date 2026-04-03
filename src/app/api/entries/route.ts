import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get("contractId");

    const where = contractId ? { contractId } : {};

    const entries = await prisma.workOrderEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        contract: true,
      },
    });

    // Format entries to match the old structure
    const formattedEntries = entries.map((entry) => ({
      _id: entry.id,
      title: entry.title,
      blankWoId: entry.blankWoId,
      contractId: entry.contractId,
      headerData: {
        date: entry.date,
        workOrder: entry.workOrder,
        assetNo: entry.assetNo,
        contractor: entry.contractor,
        address: entry.address || "",
        sawsInspector: entry.sawsInspector || "",
      },
      entries: (entry.entries as any).map((item: any) => ({
        ...item,
        checked: item.checked || false,
      })),
      totals: entry.totals as any,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      { success: true, data: formattedEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get or use default contract
    let contractId = body.contractId;
    if (!contractId) {
      const contracts = await prisma.contract.findMany();
      if (contracts.length > 0) {
        contractId = contracts[0].id;
      } else {
        // Create default contract if none exists
        const contract = await prisma.contract.create({
          data: { name: "Contract 1" },
        });
        contractId = contract.id;
      }
    }

    const entry = await prisma.workOrderEntry.create({
      data: {
        contractId,
        title: body.title,
        blankWoId: body.blankWoId,
        date: body.headerData.date,
        workOrder: body.headerData.workOrder,
        assetNo: body.headerData.assetNo,
        contractor: body.headerData.contractor,
        address: body.headerData.address,
        sawsInspector: body.headerData.sawsInspector,
        entries: body.entries,
        totals: body.totals,
      },
      include: {
        contract: true,
      },
    });

    const formattedEntry = {
      _id: entry.id,
      title: entry.title,
      blankWoId: entry.blankWoId,
      contractId: entry.contractId,
      headerData: {
        date: entry.date,
        workOrder: entry.workOrder,
        assetNo: entry.assetNo,
        contractor: entry.contractor,
        address: entry.address || "",
        sawsInspector: entry.sawsInspector || "",
      },
      entries: (entry.entries as any).map((item: any) => ({
        ...item,
        checked: item.checked || false,
      })),
      totals: entry.totals as any,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { success: true, data: formattedEntry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create entry" },
      { status: 400 }
    );
  }
}
