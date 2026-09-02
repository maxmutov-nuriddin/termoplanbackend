import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId?: mongoose.Types.ObjectId;
  title: string;
  clientName?: string;
  clientPhone?: string;
  address?: string;
  regionId: string; // e.g. 'tashkent', 'samarkand'
  compassNorthAngle: number; // 0 to 360 degrees (Plan rotation vs North)
  buildingType: 'apartment' | 'private_house' | 'office' | 'commercial';
  wallMaterial: 'brick' | 'aerated_concrete' | 'cinder_block' | 'panel' | 'monolith';
  insulationQuality: 'standard' | 'high' | 'poor';
  defaultCeilingHeight: number; // in meters (default 3.0)
  totalArea?: number;
  status: 'draft' | 'calculated' | 'approved' | 'completed';
  rooms: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true, default: 'Yangi TermoPlan Loyihasi' },
    clientName: { type: String, trim: true },
    clientPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    regionId: { type: String, required: true, default: 'tashkent' },
    compassNorthAngle: { type: Number, required: true, default: 0 },
    buildingType: {
      type: String,
      enum: ['apartment', 'private_house', 'office', 'commercial'],
      default: 'private_house',
    },
    wallMaterial: {
      type: String,
      enum: ['brick', 'aerated_concrete', 'cinder_block', 'panel', 'monolith'],
      default: 'brick',
    },
    insulationQuality: {
      type: String,
      enum: ['standard', 'high', 'poor'],
      default: 'standard',
    },
    defaultCeilingHeight: { type: Number, default: 3.0 },
    totalArea: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'calculated', 'approved', 'completed'],
      default: 'draft',
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
