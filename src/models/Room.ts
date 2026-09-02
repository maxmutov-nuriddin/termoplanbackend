import mongoose, { Schema, Document } from 'mongoose';

export interface IPoint {
  x: number;
  y: number;
}

export interface IWall {
  id: string;
  startPoint: IPoint;
  endPoint: IPoint;
  isExternal: boolean;
  orientation: string; // 'NORTH', 'EAST', 'SOUTH', 'WEST', etc.
  length: number; // meters
}

export interface IWindow {
  id: string;
  wallId?: string;
  position: IPoint;
  width: number; // meters (e.g. 1.4m)
  height: number; // meters (e.g. 1.6m)
  orientation: string;
  type: 'ordinary' | 'low_e' | 'tinted';
}

export interface IDoor {
  id: string;
  wallId?: string;
  position: IPoint;
  width: number; // meters (e.g. 0.9m)
  openDirection: string; // 'inside_left' | 'inside_right' | 'outside_left' | 'outside_right'
}

export interface IFurniture {
  id: string;
  type: 'bed' | 'sofa' | 'desk' | 'dining_table' | 'wardrobe' | 'kitchen_set' | 'tv_unit';
  label?: string;
  position: IPoint;
  width: number; // meters
  height: number; // meters
  rotation: number; // degrees
  isHeatingProhibited: boolean; // under bed/kitchen wardrobes no pipes needed
  isCoolingSensitive: boolean; // no direct cold air blowing
}

export interface IRoom extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  roomType: 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'hall' | 'office' | 'dining';
  area: number; // m²
  perimeter: number; // m
  ceilingHeight: number; // m
  points: IPoint[];
  walls: IWall[];
  windows: IWindow[];
  doors: IDoor[];
  furniture: IFurniture[];
  manifoldPosition?: IPoint;
  acPosition?: {
    x: number;
    y: number;
    wallId?: string;
    targetAngle: number;
  };
  outdoorUnitPosition?: IPoint;
  floorCovering: 'tile' | 'laminate' | 'parquet' | 'carpet';
  createdAt: Date;
  updatedAt: Date;
}

const PointSchema = new Schema<IPoint>({ x: Number, y: Number }, { _id: false });

const WallSchema = new Schema<IWall>({
  id: String,
  startPoint: PointSchema,
  endPoint: PointSchema,
  isExternal: { type: Boolean, default: true },
  orientation: { type: String, default: 'NORTH' },
  length: { type: Number, default: 0 },
}, { _id: false });

const WindowSchema = new Schema<IWindow>({
  id: String,
  wallId: String,
  position: PointSchema,
  width: { type: Number, default: 1.4 },
  height: { type: Number, default: 1.6 },
  orientation: { type: String, default: 'NORTH' },
  type: { type: String, enum: ['ordinary', 'low_e', 'tinted'], default: 'ordinary' },
}, { _id: false });

const DoorSchema = new Schema<IDoor>({
  id: String,
  wallId: String,
  position: PointSchema,
  width: { type: Number, default: 0.9 },
  openDirection: { type: String, default: 'inside_right' },
}, { _id: false });

const FurnitureSchema = new Schema<IFurniture>({
  id: String,
  type: {
    type: String,
    enum: ['bed', 'sofa', 'desk', 'dining_table', 'wardrobe', 'kitchen_set', 'tv_unit'],
    default: 'sofa',
  },
  label: String,
  position: PointSchema,
  width: { type: Number, default: 1.0 },
  height: { type: Number, default: 1.0 },
  rotation: { type: Number, default: 0 },
  isHeatingProhibited: { type: Boolean, default: true },
  isCoolingSensitive: { type: Boolean, default: true },
}, { _id: false });

const RoomSchema = new Schema<IRoom>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, default: 'Yangi xona' },
    roomType: {
      type: String,
      enum: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'hall', 'office', 'dining'],
      default: 'living_room',
    },
    area: { type: Number, required: true, default: 20 },
    perimeter: { type: Number, default: 18 },
    ceilingHeight: { type: Number, default: 3.0 },
    points: [PointSchema],
    walls: [WallSchema],
    windows: [WindowSchema],
    doors: [DoorSchema],
    furniture: [FurnitureSchema],
    manifoldPosition: PointSchema,
    acPosition: {
      x: Number,
      y: Number,
      wallId: String,
      targetAngle: { type: Number, default: 0 },
    },
    outdoorUnitPosition: PointSchema,
    floorCovering: {
      type: String,
      enum: ['tile', 'laminate', 'parquet', 'carpet'],
      default: 'tile',
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
