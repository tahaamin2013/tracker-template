import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/models/Entry";
import mongoose from "mongoose";

// GET single entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid entry ID" },
        { status: 400 }
      );
    }

    const entry = await Entry.findById(id);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: entry },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}

// DELETE entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid entry ID" },
        { status: 400 }
      );
    }

    const entry = await Entry.findByIdAndDelete(id);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: entry, message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
