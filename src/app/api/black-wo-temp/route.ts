import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.blackWoTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(
      { success: true, data: templates },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const template = await prisma.blackWoTemplate.create({
      data: {
        itemNo: body.itemNo,
        description: body.description,
        unit: body.unit,
        unitPrice: parseFloat(body.unitPrice),
        checked: body.checked || false,
      },
    });

    return NextResponse.json(
      { success: true, data: template },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create template" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const template = await prisma.blackWoTemplate.update({
      where: { id },
      data: {
        ...updateData,
        unitPrice: parseFloat(updateData.unitPrice),
      },
    });

    return NextResponse.json(
      { success: true, data: template },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update template" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    await prisma.blackWoTemplate.delete({
      where: { id }
    });

    return NextResponse.json(
      { success: true, message: "Template deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete template" },
      { status: 400 }
    );
  }
}
