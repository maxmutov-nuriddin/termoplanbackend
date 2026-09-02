import mongoose, { Schema, Document } from 'mongoose';

export interface ISmetaItem {
  id: string;
  category: 'heating' | 'cooling' | 'insulation' | 'automation' | 'installation';
  name: string;
  description?: string;
  unit: string; // 'm', 'm²', 'dona', 'komplekt', 'kW'
  quantity: number;
  unitPriceUzs: number;
  totalPriceUzs: number;
  isOptional: boolean;
}

export interface ISmeta extends Document {
  projectId: mongoose.Types.ObjectId;
  items: ISmetaItem[];
  totalHeatingCostUzs: number;
  totalCoolingCostUzs: number;
  totalInstallationCostUzs: number;
  grandTotalUzs: number;
  grandTotalUsd: number;
  usdExchangeRate: number;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SmetaItemSchema = new Schema<ISmetaItem>(
  {
    id: String,
    category: {
      type: String,
      enum: ['heating', 'cooling', 'insulation', 'automation', 'installation'],
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unitPriceUzs: { type: Number, required: true, default: 0 },
    totalPriceUzs: { type: Number, required: true, default: 0 },
    isOptional: { type: Boolean, default: false },
  },
  { _id: false }
);

const SmetaSchema = new Schema<ISmeta>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    items: [SmetaItemSchema],
    totalHeatingCostUzs: { type: Number, default: 0 },
    totalCoolingCostUzs: { type: Number, default: 0 },
    totalInstallationCostUzs: { type: Number, default: 0 },
    grandTotalUzs: { type: Number, default: 0 },
    grandTotalUsd: { type: Number, default: 0 },
    usdExchangeRate: { type: Number, default: 12850 },
    notes: [String],
  },
  { timestamps: true }
);

export const Smeta = mongoose.model<ISmeta>('Smeta', SmetaSchema);
