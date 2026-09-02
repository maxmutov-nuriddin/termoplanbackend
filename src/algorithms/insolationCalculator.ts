import { UZBEKISTAN_CLIMATE_DATA, ORIENTATION_FACTORS, ClimateRegion } from '../config/climateData';
import { IWall, IWindow } from '../models/Room';

export interface SolarPosition {
  sunriseAzimuth: number; // gradus (e.g. 60° Sharq)
  sunsetAzimuth: number;  // gradus (e.g. 300° G'arb)
  solarNoonAltitude: number; // gradus (yozgi tik quyosh burchagi e.g. 72°)
  winterNoonAltitude: number; // gradus (qishki quyosh burchagi e.g. 25°)
  daylightHoursSummer: number;
  daylightHoursWinter: number;
}

export interface WindAnalysis {
  dominantDirection: string; // 'NORTH_EAST', 'NORTH_WEST', etc.
  dominantDirectionUz: string;
  avgSpeedWinter: number; // m/s
  avgSpeedSummer: number; // m/s
  windPressurePa: number;
  windCoolingFactor: number;
  windEffectDescription: string;
}

export interface InsolationAnalysis {
  solarFactor: number;
  heatingMultiplier: number;
  coolingMultiplier: number;
  sunHoursDaily: number;
  highRiskOverheating: boolean;
  orientationSummary: string;
  solarPosition: SolarPosition;
  windAnalysis: WindAnalysis;
  wallBreakdown: Array<{
    wallId: string;
    trueOrientation: string;
    solarInfluence: string;
    windowArea: number;
    solarHeatGainW: number;
    windExposure: string;
  }>;
}

/**
 * Berilgan koordinata (kenglik) bo'yicha quyosh geometriyasini hisoblash
 */
export function calculateSolarGeometry(latitude: number): SolarPosition {
  const latRad = (latitude * Math.PI) / 180;
  
  // Yozgi quyosh turishi (21-iyun, o'q og'ishi +23.45°)
  const declinationSummer = (23.45 * Math.PI) / 180;
  // Qishki quyosh turishi (21-dekabr, o'q og'ishi -23.45°)
  const declinationWinter = (-23.45 * Math.PI) / 180;

  // Tush paytidagi quyosh balandligi (Altitude)
  const solarNoonAltitudeSummer = 90 - latitude + 23.45;
  const solarNoonAltitudeWinter = Math.max(10, 90 - latitude - 23.45);

  // Kun uzunligi hisobi (Daylight hours)
  const cosHourAngleSummer = -Math.tan(latRad) * Math.tan(declinationSummer);
  const hourAngleSummer = Math.acos(Math.max(-1, Math.min(1, cosHourAngleSummer)));
  const daylightHoursSummer = parseFloat(((hourAngleSummer * 2 * 180) / (Math.PI * 15)).toFixed(1));

  const cosHourAngleWinter = -Math.tan(latRad) * Math.tan(declinationWinter);
  const hourAngleWinter = Math.acos(Math.max(-1, Math.min(1, cosHourAngleWinter)));
  const daylightHoursWinter = parseFloat(((hourAngleWinter * 2 * 180) / (Math.PI * 15)).toFixed(1));

  // Quyosh chiqishi va botishi azimuti
  const sunriseAzimuth = Math.round(90 - (hourAngleSummer * 180 / Math.PI) / 3);
  const sunsetAzimuth = Math.round(270 + (hourAngleSummer * 180 / Math.PI) / 3);

  return {
    sunriseAzimuth: Math.max(45, sunriseAzimuth),
    sunsetAzimuth: Math.min(315, sunsetAzimuth),
    solarNoonAltitude: parseFloat(solarNoonAltitudeSummer.toFixed(1)),
    winterNoonAltitude: parseFloat(solarNoonAltitudeWinter.toFixed(1)),
    daylightHoursSummer,
    daylightHoursWinter,
  };
}

/**
 * Shamol yo'nalishi va shamol ro'zasi tahlili (O'zbekiston sharoitida)
 */
export function calculateWindAnalysis(region: ClimateRegion, compassAngle: number): WindAnalysis {
  // O'zbekiston hududlarida qishda asosan shimoliy va shimoli-sharqiy, yozda esa g'arbiy va shimoli-g'arbiy shamollar ustunlik qiladi
  const dominantDirection = region.latitude > 41 ? 'NORTH_EAST' : 'NORTH_WEST';
  const dominantDirectionUz = dominantDirection === 'NORTH_EAST' ? 'Shimoli-sharqiy (Sovuq shamol)' : 'Shimoli-g‘arbiy shamol';
  
  const avgSpeedWinter = region.windSpeedWinter || 3.0;
  const avgSpeedSummer = parseFloat((avgSpeedWinter * 0.85).toFixed(1));
  const windPressurePa = Math.round(0.5 * 1.25 * Math.pow(avgSpeedWinter, 2) * 10); // Dinamik shamol bosimi

  let windCoolingFactor = 1.0;
  if (avgSpeedWinter >= 3.5) {
    windCoolingFactor = 1.15; // Shamolli ochiq hududlarda +15% issiqlik yo'qotilishi
  }

  const windEffectDescription = `Qishda o‘rtacha ${avgSpeedWinter} m/s ${dominantDirectionUz} hisobiga shimoliy devorlarga qo‘shimcha shamol yuki tushadi.`;

  return {
    dominantDirection,
    dominantDirectionUz,
    avgSpeedWinter,
    avgSpeedSummer,
    windPressurePa,
    windCoolingFactor,
    windEffectDescription,
  };
}

/**
 * Berilgan burchakni 8 ta asosiy dunyo tomoniga aylantirish
 */
export function angleToCardinal(angleDeg: number): string {
  const normalized = ((angleDeg % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'NORTH';
  if (normalized >= 22.5 && normalized < 67.5) return 'NORTHEAST';
  if (normalized >= 67.5 && normalized < 112.5) return 'EAST';
  if (normalized >= 112.5 && normalized < 157.5) return 'SOUTHEAST';
  if (normalized >= 157.5 && normalized < 202.5) return 'SOUTH';
  if (normalized >= 202.5 && normalized < 247.5) return 'SOUTHWEST';
  if (normalized >= 247.5 && normalized < 292.5) return 'WEST';
  return 'NORTHWEST';
}

/**
 * Insolyatsiya, Quyosh nuri va Shamol balansi tahlili
 */
export function analyzeInsolation(
  regionId: string,
  compassNorthAngle: number,
  walls: IWall[],
  windows: IWindow[]
): InsolationAnalysis {
  const climate = UZBEKISTAN_CLIMATE_DATA[regionId] || UZBEKISTAN_CLIMATE_DATA['tashkent'];
  const solarPosition = calculateSolarGeometry(climate.latitude || 41.3);
  const windAnalysis = calculateWindAnalysis(climate, compassNorthAngle);

  let totalWindowArea = 0;
  let totalSolarHeatGainW = 0;
  let maxCoolingFactor = 1.0;
  let weightedHeatingFactorSum = 0;
  let weightedCoolingFactorSum = 0;
  let totalWallWeight = 0;

  const wallBreakdown: InsolationAnalysis['wallBreakdown'] = [];

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const dx = wall.endPoint.x - wall.startPoint.x;
    const dy = wall.endPoint.y - wall.startPoint.y;
    
    // Devorning normal burchagi
    const wallAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const normalAngle = (wallAngle + 90 + compassNorthAngle) % 360;
    const cardinal = angleToCardinal(normalAngle);
    
    const factorInfo = (ORIENTATION_FACTORS as Record<string, any>)[cardinal] || ORIENTATION_FACTORS.NORTH;
    const wallLength = wall.length || Math.sqrt(dx * dx + dy * dy);
    
    const wallWindows = windows.filter(w => w.wallId === wall.id || w.orientation === cardinal);
    const wallWindowArea = wallWindows.reduce((acc, w) => acc + (w.width * w.height), 0);
    totalWindowArea += wallWindowArea;

    let solarGainW = 0;
    for (const win of wallWindows) {
      const radiation = climate.solarRadiationSummer;
      const glassEfficiency = win.type === 'low_e' ? 0.45 : win.type === 'tinted' ? 0.6 : 0.85;
      const gain = win.width * win.height * radiation * glassEfficiency * (factorInfo.coolingFactor / 1.2);
      solarGainW += gain;
    }
    totalSolarHeatGainW += solarGainW;

    const wallWeight = Math.max(1, wallLength);
    weightedHeatingFactorSum += factorInfo.heatingFactor * wallWeight;
    weightedCoolingFactorSum += factorInfo.coolingFactor * wallWeight;
    totalWallWeight += wallWeight;

    if (factorInfo.coolingFactor > maxCoolingFactor) {
      maxCoolingFactor = factorInfo.coolingFactor;
    }

    const isWindExposed = ['NORTH', 'NORTHEAST', 'NORTHWEST'].includes(cardinal);

    wallBreakdown.push({
      wallId: wall.id || `wall_${i + 1}`,
      trueOrientation: factorInfo.name,
      solarInfluence: factorInfo.description,
      windowArea: parseFloat(wallWindowArea.toFixed(2)),
      solarHeatGainW: Math.round(solarGainW),
      windExposure: isWindExposed ? `Kuchli shamol yuki (${climate.windSpeedWinter} m/s)` : 'Himoyalangan fasad',
    });
  }

  const avgHeatingFactor = totalWallWeight > 0 ? weightedHeatingFactorSum / totalWallWeight : 1.0;
  const avgCoolingFactor = totalWallWeight > 0 ? weightedCoolingFactorSum / totalWallWeight : 1.0;

  const hasSouthOrWestWindows = windows.some(w => {
    const isHotSide = ['SOUTH', 'SOUTHWEST', 'WEST'].includes(w.orientation);
    return isHotSide && w.type === 'ordinary';
  });
  const highRiskOverheating = hasSouthOrWestWindows || maxCoolingFactor >= 1.25;

  let orientationSummary = `Shimoliy sovuq hudud (${windAnalysis.dominantDirectionUz} taʼsiri mavjud)`;
  if (avgCoolingFactor >= 1.20) {
    orientationSummary = `Janubiy/G‘arbiy kuchli quyosh tushuvchi hudud (Yozgi quyosh nurlanishi: ${climate.solarRadiationSummer} W/m², qishda quyosh inersiyasi mavjud)`;
  } else if (avgCoolingFactor >= 1.05) {
    orientationSummary = `Sharqiy/Janubi-sharqiy mo‘tadil quyoshli hudud (Ertalabki tabiiy isitish va qulay shamollatish)`;
  }

  return {
    solarFactor: parseFloat(avgCoolingFactor.toFixed(2)),
    heatingMultiplier: parseFloat((avgHeatingFactor * windAnalysis.windCoolingFactor).toFixed(2)),
    coolingMultiplier: parseFloat(avgCoolingFactor.toFixed(2)),
    sunHoursDaily: highRiskOverheating ? 8.5 : 6,
    highRiskOverheating,
    orientationSummary,
    solarPosition,
    windAnalysis,
    wallBreakdown,
  };
}
