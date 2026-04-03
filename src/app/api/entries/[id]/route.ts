import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const entry = await prisma.workOrderEntry.findUnique({
      where: { id },
      include: {
        contract: true,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Entry not found" },
        { status: 404 }
      );
    }

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
      },
      entries: entry.entries as any,
      totals: entry.totals as any,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { success: true, data: formattedEntry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.workOrderEntry.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
