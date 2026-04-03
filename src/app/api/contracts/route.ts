import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        entries: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Map _id to id for easier handling in frontend
    const formattedContracts = contracts.map((contract) => ({
      id: contract.id,
      name: contract.name,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    }));

    return NextResponse.json(
      { success: true, data: formattedContracts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const contract = await prisma.contract.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { success: true, data: contract },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create contract" },
      { status: 400 }
    );
  }
}
