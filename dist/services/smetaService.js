"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSmetaForProject = generateSmetaForProject;
const constants_1 = require("../config/constants");
function generateSmetaForProject(projectId, roomsCalculations) {
    const items = [];
    let totalPipeLength = 0;
    let totalManifoldPorts = 0;
    let totalInsulationArea = 0;
    let totalDampingTapeLength = 0;
    let totalServoCount = 0;
    let totalBoilerKw = 0;
    let totalHeatingLaborArea = 0;
    let totalCopperLength = 0;
    const acUnits = {}; // btu -> count
    for (const rc of roomsCalculations) {
        totalPipeLength += rc.heating.pipeLengthWithReserveM;
        totalManifoldPorts += rc.heating.manifoldPorts;
        totalInsulationArea += rc.heating.insulationAreaM2;
        totalDampingTapeLength += rc.heating.dampingTapeLengthM;
        totalServoCount += rc.heating.servoActuatorsCount;
        totalBoilerKw += rc.heating.boilerPowerKw;
        totalHeatingLaborArea += rc.area;
        totalCopperLength += rc.cooling.copperRouteLengthM;
        const btu = rc.cooling.recommendedBtu;
        acUnits[btu] = (acUnits[btu] || 0) + 1;
    }
    // 1. QISHTI ISITISH MATERIALLARI
    items.push({
        id: 'pipe_pex',
        category: 'heating',
        name: 'Isitish quvuri PERT / PEX-A 16x2.0mm (EVOH kislorod to‘siqli)',
        description: '+10% texnologik zaxira va kollektorga ulanishlar hisobga olingan',
        unit: 'm',
        quantity: Math.round(totalPipeLength),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.PEX_PIPE_PER_M,
        totalPriceUzs: Math.round(totalPipeLength * constants_1.DEFAULT_PRICES_UZS.PEX_PIPE_PER_M),
        isOptional: false,
    });
    items.push({
        id: 'collector_manifold',
        category: 'heating',
        name: `Kollektor guruhi sarf-o‘lchagichlar (rotametr) bilan (${Math.max(2, totalManifoldPorts)} kontur)`,
        description: 'Har bir kontur oqimini aniq balanslash imkoniyati bilan',
        unit: 'chiqish',
        quantity: Math.max(2, totalManifoldPorts),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.COLLECTOR_PER_PORT,
        totalPriceUzs: Math.max(2, totalManifoldPorts) * constants_1.DEFAULT_PRICES_UZS.COLLECTOR_PER_PORT,
        isOptional: false,
    });
    items.push({
        id: 'eps_insulation',
        category: 'insulation',
        name: 'Penopolistirol (EPS) 30mm pol osti issiqlik izolyatsiyasi plitasi',
        description: 'Pastga issiqlik ketishini to‘suvchi yuqori zichlikdagi qatlam',
        unit: 'm²',
        quantity: Math.round(totalInsulationArea),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.EPS_INSULATION_PER_M2,
        totalPriceUzs: Math.round(totalInsulationArea * constants_1.DEFAULT_PRICES_UZS.EPS_INSULATION_PER_M2),
        isOptional: false,
    });
    items.push({
        id: 'damping_tape',
        category: 'insulation',
        name: 'Damping devor kompensatsiya lentasi (8x150mm)',
        description: 'Beton styajka kengayishi va devor orqali issiqlik yo‘qotilishidan himoya',
        unit: 'm',
        quantity: Math.round(totalDampingTapeLength),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.DAMPING_TAPE_PER_M,
        totalPriceUzs: Math.round(totalDampingTapeLength * constants_1.DEFAULT_PRICES_UZS.DAMPING_TAPE_PER_M),
        isOptional: false,
    });
    const clipsCount = Math.round(totalInsulationArea * 15);
    items.push({
        id: 'pipe_clips',
        category: 'heating',
        name: 'Quvur fiksatorlari (Tacker clips / garpun-qisqichlar)',
        description: 'Quvurni izolyatsiyaga mahkamlash uchun',
        unit: 'dona',
        quantity: clipsCount,
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.PIPE_CLIPS_PER_UNIT,
        totalPriceUzs: clipsCount * constants_1.DEFAULT_PRICES_UZS.PIPE_CLIPS_PER_UNIT,
        isOptional: false,
    });
    if (totalServoCount > 0) {
        items.push({
            id: 'servo_actuator',
            category: 'automation',
            name: 'Termoelektrik servo-klapan (220V/24V, NC)',
            description: 'Quyoshli xonalarni avtomatik o‘chirib-yoqish va qizib ketishdan himoya',
            unit: 'dona',
            quantity: totalServoCount,
            unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.SERVO_ACTUATOR_PER_UNIT,
            totalPriceUzs: totalServoCount * constants_1.DEFAULT_PRICES_UZS.SERVO_ACTUATOR_PER_UNIT,
            isOptional: false,
        });
        items.push({
            id: 'room_thermostats',
            category: 'automation',
            name: 'Aqlli xona termostati (Sensori bilan)',
            description: 'Pol va havo haroratini aniq nazorat qiluvchi devor paneli',
            unit: 'dona',
            quantity: Math.min(totalServoCount, roomsCalculations.length),
            unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.ROOM_THERMOSTAT_PER_UNIT,
            totalPriceUzs: Math.min(totalServoCount, roomsCalculations.length) * constants_1.DEFAULT_PRICES_UZS.ROOM_THERMOSTAT_PER_UNIT,
            isOptional: false,
        });
    }
    const finalBoilerKw = Math.max(12, Math.ceil(totalBoilerKw * 1.2));
    items.push({
        id: 'heating_boiler',
        category: 'heating',
        name: `Isitish qozoni (Kondensatsion/Elektr) ~${finalBoilerKw} kW quvvatli`,
        description: 'Hisobiy maksimal sovuq va issiq suv taʼminotini to‘liq qoplaydi',
        unit: 'komplekt',
        quantity: 1,
        unitPriceUzs: finalBoilerKw * constants_1.DEFAULT_PRICES_UZS.BOILER_PER_KW,
        totalPriceUzs: finalBoilerKw * constants_1.DEFAULT_PRICES_UZS.BOILER_PER_KW,
        isOptional: true,
    });
    // 2. YOZGI SOVUTISH MATERIALLARI
    for (const [btuStr, count] of Object.entries(acUnits)) {
        const btu = parseInt(btuStr, 10);
        const unitPrice = constants_1.DEFAULT_PRICES_UZS[`AC_${btu}_BTU`] || constants_1.DEFAULT_PRICES_UZS.AC_9000_BTU;
        items.push({
            id: `ac_unit_${btu}`,
            category: 'cooling',
            name: `Inverter Split Konditsioner (${btu.toLocaleString()} BTU)`,
            description: 'A++ energosamarador, kam shovqinli va ekologik R32 freonli',
            unit: 'dona',
            quantity: count,
            unitPriceUzs: unitPrice,
            totalPriceUzs: count * unitPrice,
            isOptional: false,
        });
    }
    items.push({
        id: 'copper_trass_kit',
        category: 'cooling',
        name: 'Mis quvur trassasi to‘plami (Izolyatsiya + drenaj + 4-simli kabel)',
        description: 'Ichki va tashqi blok orasidagi to‘liq magistral',
        unit: 'm',
        quantity: Math.max(4, Math.round(totalCopperLength)),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.COPPER_PIPE_KIT_PER_M,
        totalPriceUzs: Math.max(4, Math.round(totalCopperLength)) * constants_1.DEFAULT_PRICES_UZS.COPPER_PIPE_KIT_PER_M,
        isOptional: false,
    });
    const totalAcCount = Object.values(acUnits).reduce((sum, c) => sum + c, 0);
    items.push({
        id: 'ac_bracket',
        category: 'cooling',
        name: 'Konditsioner tashqi bloki metall kronshteyni + vibratsiya o‘chirgich',
        unit: 'komplekt',
        quantity: totalAcCount,
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.OUTDOOR_BRACKET_SET,
        totalPriceUzs: totalAcCount * constants_1.DEFAULT_PRICES_UZS.OUTDOOR_BRACKET_SET,
        isOptional: false,
    });
    // 3. MONTAJ VA O'RNATISH XIZMATI
    items.push({
        id: 'install_underfloor',
        category: 'installation',
        name: 'Tyoply pol va izolyatsiyani yotqizish hamda gipravlik qisish xizmati',
        unit: 'm²',
        quantity: Math.round(totalHeatingLaborArea),
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.INSTALLATION_WORK_HEATING_PER_M2,
        totalPriceUzs: Math.round(totalHeatingLaborArea * constants_1.DEFAULT_PRICES_UZS.INSTALLATION_WORK_HEATING_PER_M2),
        isOptional: true,
    });
    items.push({
        id: 'install_ac',
        category: 'installation',
        name: 'Konditsioner ichki va tashqi blokini professional o‘rnatish va vakuumni tortish',
        unit: 'dona',
        quantity: totalAcCount,
        unitPriceUzs: constants_1.DEFAULT_PRICES_UZS.INSTALLATION_WORK_AC_PER_UNIT,
        totalPriceUzs: totalAcCount * constants_1.DEFAULT_PRICES_UZS.INSTALLATION_WORK_AC_PER_UNIT,
        isOptional: true,
    });
    let totalHeatingCostUzs = 0;
    let totalCoolingCostUzs = 0;
    let totalInstallationCostUzs = 0;
    for (const it of items) {
        if (['heating', 'insulation', 'automation'].includes(it.category)) {
            totalHeatingCostUzs += it.totalPriceUzs;
        }
        else if (it.category === 'cooling') {
            totalCoolingCostUzs += it.totalPriceUzs;
        }
        else if (it.category === 'installation') {
            totalInstallationCostUzs += it.totalPriceUzs;
        }
    }
    const grandTotalUzs = totalHeatingCostUzs + totalCoolingCostUzs + totalInstallationCostUzs;
    const usdExchangeRate = 12850;
    const grandTotalUsd = Math.round(grandTotalUzs / usdExchangeRate);
    const notes = [
        'Barcha hisob-kitoblar O‘zbekiston iqlimiy me’yorlari (QMQ) asosida shakllantirilgan.',
        'Quvurlar uzunligiga +10% montaj va kesim zaxirasi kiritilgan.',
        'Smetadagi narxlar o‘rtacha bozor narxlari bo‘lib, brend tanloviga qarab farq qilishi mumkin.',
    ];
    return {
        projectId,
        items,
        totalHeatingCostUzs,
        totalCoolingCostUzs,
        totalInstallationCostUzs,
        grandTotalUzs,
        grandTotalUsd,
        usdExchangeRate,
        notes,
    };
}
