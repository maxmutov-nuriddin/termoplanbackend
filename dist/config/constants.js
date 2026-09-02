"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PRICES_UZS = exports.COOLING_CONSTANTS = exports.HEATING_CONSTANTS = void 0;
exports.HEATING_CONSTANTS = {
    // Quvurlar qadami (metrlarda)
    STEP_COLD_ZONE: 0.10, // 10 sm (Oyna osti va tashqi sovuq devorlar bo'ylab chegara zonasi)
    STEP_COMFORT_ZONE: 0.15, // 15 sm (Markaziy yashash hududi)
    STEP_SUNNY_ZONE: 0.20, // 20 sm (Quyoshli / kam issiqlik yo'qotuvchi hudud)
    STEP_BUFFER_ZONE: 0.25, // 25 sm (Tranzit va yordamchi hududlar)
    // Chegara zonasi kengligi
    BOUNDARY_ZONE_WIDTH: 0.8, // 0.8 metr tashqi devor va oynadan ichkariga
    // Quvur parametri
    PIPE_DIAMETER_MM: 16,
    PIPE_WALL_MM: 2.0,
    PIPE_TYPE: 'PERT / PEX-A 16x2.0mm kislorod to‘siqli (EVOH)',
    // Kontur chegaralari
    MAX_LOOP_LENGTH_M: 90, // Bitta konturning maksimal tavsiya etilgan uzunligi (80-100m)
    MIN_LOOP_LENGTH_M: 30,
    RESERVE_PERCENTAGE: 0.10, // +10% zaxira va ulanishlar uchun
    // Issiqlik quvvati me'yori (W/m²)
    BASE_HEAT_LOSS_W_M2: 70, // Standart zamonaviy g'isht/gazobeton uylar uchun
    COMFORT_FLOOR_TEMP_C: 26, // Sanitariya me'yori bo'yicha pol sirt harorati
    MAX_FLOOR_TEMP_C: 29,
    SUPPLY_WATER_TEMP_C: 40, // Kiruvchi suv harorati
    RETURN_WATER_TEMP_C: 35, // Qaytuvchi suv harorati (ΔT = 5°C)
};
exports.COOLING_CONSTANTS = {
    BASE_COOLING_W_M3: 40, // 1 m³ hajm uchun bazaviy sovutish quvvati (W)
    PERSON_HEAT_W: 100, // 1 kishi uchun issiqlik ajralishi
    APPLIANCE_HEAT_W: 200, // Standart maishiy texnika issiqligi
    WINDOW_HEAT_ORDINARY_W_M2: 180, // Oddiy oynadan quyosh issiqlik tushishi (W/m²)
    WINDOW_HEAT_LOW_E_W_M2: 90, // Low-E energosamarador oynadan issiqlik tushishi (W/m²)
    // BTU Standart modellari
    BTU_SIZES: [
        { btu: 7000, kw: 2.1, maxAreaM2: 18, name: '07 modeli (7 000 BTU / 2.1 kW)' },
        { btu: 9000, kw: 2.6, maxAreaM2: 26, name: '09 modeli (9 000 BTU / 2.6 kW)' },
        { btu: 12000, kw: 3.5, maxAreaM2: 36, name: '12 modeli (12 000 BTU / 3.5 kW)' },
        { btu: 18000, kw: 5.3, maxAreaM2: 52, name: '18 modeli (18 000 BTU / 5.3 kW)' },
        { btu: 24000, kw: 7.0, maxAreaM2: 72, name: '24 modeli (24 000 BTU / 7.0 kW)' },
        { btu: 36000, kw: 10.5, maxAreaM2: 105, name: '36 modeli (36 000 BTU / 10.5 kW)' }
    ],
    // AC joylashtirish parametrlari
    AIRFLOW_ANGLE_DEG: 55, // Sovuq havo oqimi tarqalish burchagi
    AIRFLOW_RANGE_M: 4.5, // Samarali havo oqimi uzunligi (metr)
    MIN_FURNITURE_CLEARANCE_M: 1.5, // Krovat/divangacha xavfsiz minimal masofa
};
// O'zbekiston bozoridagi o'rtacha materiallar narxi (UZS)
exports.DEFAULT_PRICES_UZS = {
    // Qishki isitish
    PEX_PIPE_PER_M: 7500, // 1 metr PEX-A/PERT quvur
    COLLECTOR_PER_PORT: 120000, // Kollektor guruhi (1 chiqish uchun sarf-o'lchagich bilan)
    EPS_INSULATION_PER_M2: 28000, // Penopolistirol (EPS) 30mm plita
    DAMPING_TAPE_PER_M: 3500, // Damping devor lentasi
    PIPE_CLIPS_PER_UNIT: 250, // Plastik fiksator / garpun (1 m² ga ~15 dona)
    SERVO_ACTUATOR_PER_UNIT: 140000, // Termoelektrik servo-klapan (220V/24V)
    ROOM_THERMOSTAT_PER_UNIT: 220000, // Aqlli xona termostati (Wi-Fi / Sensor)
    BOILER_PER_KW: 450000, // Gaz/Elektr qozon quvvat narxi (1 kW ga)
    CIRCULATION_PUMP: 650000, // Qayta haydash nasosi
    // Yozgi sovutish
    AC_7000_BTU: 3200000,
    AC_9000_BTU: 3800000,
    AC_12000_BTU: 4600000,
    AC_18000_BTU: 6800000,
    AC_24000_BTU: 8900000,
    AC_36000_BTU: 13500000,
    COPPER_PIPE_KIT_PER_M: 110000, // 1 metr mis quvur + izolyatsiya + drenaj + kabel
    OUTDOOR_BRACKET_SET: 95000, // Tashqi blok kronshteyni
    INSTALLATION_WORK_HEATING_PER_M2: 35000, // Tyoply pol o'rnatish xizmati (1 m²)
    INSTALLATION_WORK_AC_PER_UNIT: 400000 // Konditsioner o'rnatish xizmati
};
