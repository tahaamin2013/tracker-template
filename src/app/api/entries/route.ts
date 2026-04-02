import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/models/Entry";

// GET all entries
export async function GET() {
  try {
    await connectDB();

    const entries = await Entry.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: entries },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

// POST create a new entry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const entry = await Entry.create(body);

    return NextResponse.json(
      { success: true, data: entry },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create entry" },
      { status: 400 }
    );
  }
}
