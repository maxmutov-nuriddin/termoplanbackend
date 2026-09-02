export interface ClimateRegion {
  id: string;
  name: string;
  nameUz: string;
  minWinterTemp: number; // °C (qishki eng past hisobiy harorat)
  maxSummerTemp: number; // °C (yozgi eng yuqori hisobiy harorat)
  avgWinterTemp: number;
  avgSummerTemp: number;
  solarRadiationSummer: number; // W/m² (yozgi quyosh radiatsiyasi)
  solarRadiationWinter: number; // W/m² (qishki quyosh radiatsiyasi)
  windSpeedWinter: number; // m/s
  humiditySummer: number; // %
  latitude: number;
  longitude: number;
}

export const UZBEKISTAN_CLIMATE_DATA: Record<string, ClimateRegion> = {
  tashkent: {
    id: 'tashkent',
    name: 'Tashkent',
    nameUz: 'Toshkent shahri va viloyati',
    minWinterTemp: -15,
    maxSummerTemp: 42,
    avgWinterTemp: 1.5,
    avgSummerTemp: 32.5,
    solarRadiationSummer: 820,
    solarRadiationWinter: 350,
    windSpeedWinter: 2.8,
    humiditySummer: 35,
    latitude: 41.2995,
    longitude: 69.2401,
  },
  samarkand: {
    id: 'samarkand',
    name: 'Samarkand',
    nameUz: 'Samarqand viloyati',
    minWinterTemp: -14,
    maxSummerTemp: 41,
    avgWinterTemp: 2.0,
    avgSummerTemp: 31.0,
    solarRadiationSummer: 840,
    solarRadiationWinter: 370,
    windSpeedWinter: 2.5,
    humiditySummer: 32,
    latitude: 39.6270,
    longitude: 66.9749,
  },
  bukhara: {
    id: 'bukhara',
    name: 'Bukhara',
    nameUz: 'Buxoro viloyati',
    minWinterTemp: -16,
    maxSummerTemp: 45,
    avgWinterTemp: 1.0,
    avgSummerTemp: 34.5,
    solarRadiationSummer: 870,
    solarRadiationWinter: 380,
    windSpeedWinter: 3.2,
    humiditySummer: 25,
    latitude: 39.7681,
    longitude: 64.4556,
  },
  fergana: {
    id: 'fergana',
    name: 'Fergana',
    nameUz: "Farg'ona viloyati",
    minWinterTemp: -12,
    maxSummerTemp: 40,
    avgWinterTemp: 2.5,
    avgSummerTemp: 31.5,
    solarRadiationSummer: 810,
    solarRadiationWinter: 340,
    windSpeedWinter: 2.0,
    humiditySummer: 38,
    latitude: 40.3842,
    longitude: 71.7843,
  },
  andijan: {
    id: 'andijan',
    name: 'Andijan',
    nameUz: 'Andijon viloyati',
    minWinterTemp: -13,
    maxSummerTemp: 39,
    avgWinterTemp: 2.0,
    avgSummerTemp: 30.5,
    solarRadiationSummer: 800,
    solarRadiationWinter: 330,
    windSpeedWinter: 2.2,
    humiditySummer: 40,
    latitude: 40.7821,
    longitude: 72.3442,
  },
  namangan: {
    id: 'namangan',
    name: 'Namangan',
    nameUz: 'Namangan viloyati',
    minWinterTemp: -13,
    maxSummerTemp: 40,
    avgWinterTemp: 2.0,
    avgSummerTemp: 31.0,
    solarRadiationSummer: 815,
    solarRadiationWinter: 345,
    windSpeedWinter: 2.3,
    humiditySummer: 36,
    latitude: 40.9983,
    longitude: 71.6726,
  },
  qashqadaryo: {
    id: 'qashqadaryo',
    name: 'Qashqadaryo',
    nameUz: 'Qashqadaryo (Qarshi) viloyati',
    minWinterTemp: -14,
    maxSummerTemp: 44,
    avgWinterTemp: 3.0,
    avgSummerTemp: 34.0,
    solarRadiationSummer: 880,
    solarRadiationWinter: 390,
    windSpeedWinter: 3.0,
    humiditySummer: 28,
    latitude: 38.8606,
    longitude: 65.7891,
  },
  surxondaryo: {
    id: 'surxondaryo',
    name: 'Surxondaryo',
    nameUz: 'Surxondaryo (Termiz) viloyati',
    minWinterTemp: -10,
    maxSummerTemp: 46,
    avgWinterTemp: 4.5,
    avgSummerTemp: 36.0,
    solarRadiationSummer: 900,
    solarRadiationWinter: 410,
    windSpeedWinter: 2.7,
    humiditySummer: 24,
    latitude: 37.2242,
    longitude: 67.2783,
  },
  xorazm: {
    id: 'xorazm',
    name: 'Xorazm',
    nameUz: 'Xorazm (Urganch/Xiva) viloyati',
    minWinterTemp: -18,
    maxSummerTemp: 43,
    avgWinterTemp: -1.0,
    avgSummerTemp: 33.0,
    solarRadiationSummer: 850,
    solarRadiationWinter: 360,
    windSpeedWinter: 3.5,
    humiditySummer: 30,
    latitude: 41.5566,
    longitude: 60.6310,
  },
  qoraqalpogiston: {
    id: 'qoraqalpogiston',
    name: 'Qoraqalpogiston',
    nameUz: "Qoraqalpog'iston (Nukus)",
    minWinterTemp: -22,
    maxSummerTemp: 44,
    avgWinterTemp: -3.0,
    avgSummerTemp: 33.5,
    solarRadiationSummer: 860,
    solarRadiationWinter: 350,
    windSpeedWinter: 4.0,
    humiditySummer: 27,
    latitude: 42.4602,
    longitude: 59.6166,
  },
  navoiy: {
    id: 'navoiy',
    name: 'Navoiy',
    nameUz: 'Navoiy viloyati',
    minWinterTemp: -16,
    maxSummerTemp: 44,
    avgWinterTemp: 1.5,
    avgSummerTemp: 33.5,
    solarRadiationSummer: 875,
    solarRadiationWinter: 385,
    windSpeedWinter: 3.4,
    humiditySummer: 26,
    latitude: 40.0844,
    longitude: 65.3792,
  },
  jizzax: {
    id: 'jizzax',
    name: 'Jizzax',
    nameUz: 'Jizzax viloyati',
    minWinterTemp: -15,
    maxSummerTemp: 42,
    avgWinterTemp: 1.8,
    avgSummerTemp: 32.0,
    solarRadiationSummer: 835,
    solarRadiationWinter: 365,
    windSpeedWinter: 3.1,
    humiditySummer: 31,
    latitude: 40.1158,
    longitude: 67.8422,
  },
  sirdaryo: {
    id: 'sirdaryo',
    name: 'Sirdaryo',
    nameUz: 'Sirdaryo (Guliston) viloyati',
    minWinterTemp: -15,
    maxSummerTemp: 42,
    avgWinterTemp: 1.6,
    avgSummerTemp: 32.5,
    solarRadiationSummer: 830,
    solarRadiationWinter: 360,
    windSpeedWinter: 3.3,
    humiditySummer: 34,
    latitude: 40.4897,
    longitude: 68.7844,
  }
};

export const ORIENTATION_FACTORS = {
  NORTH: {
    name: 'Shimol (North)',
    heatingFactor: 1.10, // Sovuqroq, quyosh tushmaydi
    coolingFactor: 0.85, // Issiqlik kam tushadi
    sunHoursSummer: 2,
    sunHoursWinter: 0,
    description: 'Soyadagi sovuq tomon, qishda qo‘shimcha isitish talab qiladi.'
  },
  NORTHEAST: {
    name: 'Shimoli-sharq (North-East)',
    heatingFactor: 1.05,
    coolingFactor: 0.95,
    sunHoursSummer: 4,
    sunHoursWinter: 1,
    description: 'Ertalabki yengil quyosh nuri.'
  },
  EAST: {
    name: 'Sharq (East)',
    heatingFactor: 1.00,
    coolingFactor: 1.10,
    sunHoursSummer: 6,
    sunHoursWinter: 3,
    description: 'Ertalabki faol quyosh, tushgacha isiydi.'
  },
  SOUTHEAST: {
    name: 'Janubi-sharq (South-East)',
    heatingFactor: 0.90,
    coolingFactor: 1.15,
    sunHoursSummer: 7,
    sunHoursWinter: 5,
    description: 'Ertalabdan tushgacha kuchli tabiiy isitish.'
  },
  SOUTH: {
    name: 'Janub (South)',
    heatingFactor: 0.85, // Qishda quyosh yaxshi isitadi
    coolingFactor: 1.25, // Yozda tik quyosh kuchli qizdiradi
    sunHoursSummer: 9,
    sunHoursWinter: 7,
    description: 'Eng quyoshli tomon, qishda issiq inersiya, yozda kuchli sovutish talab etiladi.'
  },
  SOUTHWEST: {
    name: 'Janubi-g‘arb (South-West)',
    heatingFactor: 0.90,
    coolingFactor: 1.30,
    sunHoursSummer: 8,
    sunHoursWinter: 5,
    description: 'Kunning eng issiq vaqtida to‘g‘ridan-to‘g‘ri qizdiruvchi nurlar.'
  },
  WEST: {
    name: 'G‘arb (West)',
    heatingFactor: 0.95,
    coolingFactor: 1.35, // Yozgi kechki kuchli qizdiruvchi quyosh
    sunHoursSummer: 7,
    sunHoursWinter: 4,
    description: 'Kechki quyosh devor va oynalarni maksimal qizdiradi.'
  },
  NORTHWEST: {
    name: 'Shimoli-g‘arb (North-West)',
    heatingFactor: 1.05,
    coolingFactor: 1.10,
    sunHoursSummer: 5,
    sunHoursWinter: 2,
    description: 'Kechki quyoshning qoldiq nurlari va shimoliy shamol.'
  }
};
