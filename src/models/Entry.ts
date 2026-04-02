import mongoose, { Schema, models } from "mongoose";

export interface IEntry {
  headerData: {
    date: string;
    workOrder: string;
    assetNo: string;
    contractor: string;
  };
  entries: Array<{
    id: string;
    itemNo: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    measurements: string;
  }>;
  totals: {
    quantity: number;
    totalValue: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>(
  {
    headerData: {
      date: { type: String, required: true },
      workOrder: { type: String, default: "" },
      assetNo: { type: String, default: "" },
      contractor: { type: String, default: "" },
    },
    entries: [
      {
        id: { type: String, required: true },
        itemNo: { type: String, default: "" },
        description: { type: String, default: "" },
        unit: { type: String, default: "" },
        quantity: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 0 },
        totalValue: { type: Number, default: 0 },
        measurements: { type: String, default: "" },
      },
    ],
    totals: {
      quantity: { type: Number, default: 0 },
      totalValue: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Entry = models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);

export default Entry;
