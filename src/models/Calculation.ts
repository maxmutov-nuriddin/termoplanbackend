import mongoose, { Schema, Document } from 'mongoose';

export interface ICalculation extends Document {
  projectId: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  
  // Qishki isitish hisoboti
  heating: {
    totalHeatLossW: number;
    specificHeatLossWM2: number;
    shagZones: Array<{
      zone: string;
      stepCm: number;
      areaM2: number;
      description: string;
    }>;
    pipeLengthM: number;
    pipeLengthWithReserveM: number;
    circuitsCount: number;
    circuits: Array<{
      circuitNumber: number;
      lengthM: number;
      color: string;
      points: Array<{ x: number; y: number }>;
    }>;
    manifoldPorts: number;
    servoActuatorsCount: number;
    boilerPowerKw: number;
    screedRecommendation: 'classic_concrete' | 'dry_lightweight';
    screedDescription: string;
    comfortModeTempC: number;
    insulationAreaM2: number;
    dampingTapeLengthM: number;
  };

  // Yozgi sovutish hisoboti
  cooling: {
    totalCoolingLoadW: number;
    recommendedBtu: number;
    recommendedKw: number;
    recommendedModel: string;
    optimalAcPosition: {
      x: number;
      y: number;
      wallId?: string;
      targetAngle: number;
    };
    airflowCone: {
      origin: { x: number; y: number };
      angle: number;
      spreadDeg: number;
      rangeM: number;
      polygonPoints: Array<{ x: number; y: number }>;
    };
    outdoorUnitPosition: { x: number; y: number };
    copperRouteLengthM: number;
    directBlowingAvoided: boolean;
    safetyNotes: string[];
  };

  // Insolyatsiya hisoboti
  insolation: {
    solarFactor: number;
    highRiskOverheating: boolean;
    sunHoursDaily: number;
    orientationSummary: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const CalculationSchema = new Schema<ICalculation>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    heating: {
      totalHeatLossW: { type: Number, default: 0 },
      specificHeatLossWM2: { type: Number, default: 0 },
      shagZones: [
        {
          zone: String,
          stepCm: Number,
          areaM2: Number,
          description: String,
        },
      ],
      pipeLengthM: { type: Number, default: 0 },
      pipeLengthWithReserveM: { type: Number, default: 0 },
      circuitsCount: { type: Number, default: 1 },
      circuits: [
        {
          circuitNumber: Number,
          lengthM: Number,
          color: String,
          points: [{ x: Number, y: Number }],
        },
      ],
      manifoldPorts: { type: Number, default: 2 },
      servoActuatorsCount: { type: Number, default: 1 },
      boilerPowerKw: { type: Number, default: 0 },
      screedRecommendation: {
        type: String,
        enum: ['classic_concrete', 'dry_lightweight'],
        default: 'classic_concrete',
      },
      screedDescription: String,
      comfortModeTempC: { type: Number, default: 23 },
      insulationAreaM2: { type: Number, default: 0 },
      dampingTapeLengthM: { type: Number, default: 0 },
    },
    cooling: {
      totalCoolingLoadW: { type: Number, default: 0 },
      recommendedBtu: { type: Number, default: 9000 },
      recommendedKw: { type: Number, default: 2.6 },
      recommendedModel: String,
      optimalAcPosition: {
        x: Number,
        y: Number,
        wallId: String,
        targetAngle: { type: Number, default: 0 },
      },
      airflowCone: {
        origin: { x: Number, y: Number },
        angle: Number,
        spreadDeg: Number,
        rangeM: Number,
        polygonPoints: [{ x: Number, y: Number }],
      },
      outdoorUnitPosition: { x: Number, y: Number },
      copperRouteLengthM: { type: Number, default: 3 },
      directBlowingAvoided: { type: Boolean, default: true },
      safetyNotes: [String],
    },
    insolation: {
      solarFactor: { type: Number, default: 1.0 },
      highRiskOverheating: { type: Boolean, default: false },
      sunHoursDaily: { type: Number, default: 6 },
      orientationSummary: String,
    },
  },
  { timestamps: true }
);

export const Calculation = mongoose.model<ICalculation>('Calculation', CalculationSchema);
