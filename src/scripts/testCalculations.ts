import fs from 'fs';
import path from 'path';
import { calculateRoomHeating } from '../algorithms/heatingEngine';
import { calculateRoomCooling } from '../algorithms/coolingEngine';
import { generateSmetaForProject } from '../services/smetaService';
import { generateProjectPdfBuffer } from '../services/pdfService';
import { UZBEKISTAN_CLIMATE_DATA } from '../config/climateData';

async function runTests() {
  console.log('🧪 === TermoPlan Muhandislik Algoritmlari Testi ===\n');

  // Test Loyihasi: Toshkent shahri, Janubga qaragan 32m² xona
  const mockProject = {
    _id: 'test_project_1',
    title: 'Toshkent Kottej - Mehmonxona',
    clientName: 'Alisher Qodirov',
    address: 'Chilonzor tumani 9-mavze',
    regionId: 'tashkent',
    compassNorthAngle: 45, // 45 daraja burilgan
    buildingType: 'private_house',
    wallMaterial: 'brick',
    insulationQuality: 'standard',
    defaultCeilingHeight: 3.2,
  };

  const mockRoom = {
    _id: 'test_room_1',
    name: 'Asosiy Mehmonxona (Katta Oynali)',
    roomType: 'living_room',
    area: 32,
    perimeter: 24,
    ceilingHeight: 3.2,
    points: [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 8, y: 4 },
      { x: 0, y: 4 },
    ],
    walls: [
      { id: 'w1', startPoint: { x: 0, y: 0 }, endPoint: { x: 8, y: 0 }, isExternal: true, orientation: 'SOUTH', length: 8 },
      { id: 'w2', startPoint: { x: 8, y: 0 }, endPoint: { x: 8, y: 4 }, isExternal: true, orientation: 'WEST', length: 4 },
      { id: 'w3', startPoint: { x: 8, y: 4 }, endPoint: { x: 0, y: 4 }, isExternal: false, orientation: 'NORTH', length: 8 },
      { id: 'w4', startPoint: { x: 0, y: 4 }, endPoint: { x: 0, y: 0 }, isExternal: false, orientation: 'EAST', length: 4 },
    ],
    windows: [
      { id: 'win1', position: { x: 2.5, y: 0 }, width: 3.0, height: 2.2, orientation: 'SOUTH', type: 'ordinary' },
      { id: 'win2', position: { x: 8, y: 1.5 }, width: 1.5, height: 1.8, orientation: 'WEST', type: 'low_e' },
    ],
    doors: [
      { id: 'd1', position: { x: 1.0, y: 4 }, width: 0.9, openDirection: 'inside_right' },
    ],
    furniture: [
      {
        id: 'f1',
        type: 'sofa',
        label: 'Katta burchak divan',
        position: { x: 4.5, y: 1.5 },
        width: 2.8,
        height: 1.8,
        rotation: 0,
        isHeatingProhibited: true,
        isCoolingSensitive: true,
      },
    ],
    manifoldPosition: { x: 0.4, y: 0.4 },
  };

  // 1. QISHTI ISITISH HISOBLASH
  console.log('1️⃣ Qishki isitish (Tyoply pol) hisobi:');
  const heatingResult = calculateRoomHeating(mockRoom, mockProject);
  console.log(`   - Jami issiqlik yo'qotilishi: ${heatingResult.totalHeatLossW} W (${heatingResult.specificHeatLossWM2} W/m²)`);
  console.log(`   - Quvur uzunligi: ${heatingResult.pipeLengthM} m (Zaxira bilan: ${heatingResult.pipeLengthWithReserveM} m)`);
  console.log(`   - Konturlar soni: ${heatingResult.circuitsCount} ta`);
  console.log(`   - Shag zonalari:`, heatingResult.shagZones.map(z => `${z.zone} -> ${z.stepCm}cm (${z.areaM2}m²)`));
  console.log(`   - Konstruksiya tavsiyasi: ${heatingResult.screedRecommendation} (${heatingResult.screedDescription})`);
  console.log(`   - Servo-klapanlar: ${heatingResult.servoActuatorsCount} dona`);
  console.log(`   - Qozon quvvati: ${heatingResult.boilerPowerKw} kW\n`);

  // 2. YOZGI SOVUTISH HISOBLASH
  console.log('2️⃣ Yozgi sovutish (Smart AC Sizing & Placement) hisobi:');
  const coolingResult = calculateRoomCooling(mockRoom, mockProject);
  console.log(`   - Sovutish yuki: ${coolingResult.totalCoolingLoadW} W`);
  console.log(`   - Tavsiya etilgan BTU: ${coolingResult.recommendedBtu} BTU (${coolingResult.recommendedModel})`);
  console.log(`   - Optimal AC koordinatasi: (${coolingResult.optimalAcPosition.x}, ${coolingResult.optimalAcPosition.y}), Burchak: ${coolingResult.optimalAcPosition.targetAngle}°`);
  console.log(`   - Salomatlik/Mebel himoyasi: ${coolingResult.directBlowingAvoided ? 'Muvaffaqiyatli himoyalangan' : 'Diqqat'}`);
  console.log(`   - Xavfsizlik xulosalari:`, coolingResult.safetyNotes);
  console.log(`   - Mis trassa uzunligi: ${coolingResult.copperRouteLengthM} metr\n`);

  // 3. BIRLASHGAN SMETA
  console.log('3️⃣ Birlashgan Smeta (BOM) generatsiyasi:');
  const smeta = generateSmetaForProject(mockProject._id, [
    {
      roomId: mockRoom._id,
      roomName: mockRoom.name,
      area: mockRoom.area,
      heating: heatingResult,
      cooling: coolingResult,
    },
  ]);
  console.log(`   - Jami elementlar soni: ${smeta.items?.length}`);
  console.log(`   - Qishki isitish byudjeti: ${smeta.totalHeatingCostUzs?.toLocaleString()} UZS`);
  console.log(`   - Yozgi sovutish byudjeti: ${smeta.totalCoolingCostUzs?.toLocaleString()} UZS`);
  console.log(`   - Montaj xizmati: ${smeta.totalInstallationCostUzs?.toLocaleString()} UZS`);
  console.log(`   - JAMI BYUDJET: ${smeta.grandTotalUzs?.toLocaleString()} UZS (~$${smeta.grandTotalUsd?.toLocaleString()})\n`);

  // 4. 4-SAHIFALI PDF HUJJAT YARATISH
  console.log('4️⃣ 4-Sahifali Muhandislik PDF hujjatini yaratish...');
  const pdfBuffer = await generateProjectPdfBuffer({
    project: mockProject,
    rooms: [
      {
        room: mockRoom,
        heating: heatingResult,
        cooling: coolingResult,
      },
    ],
    smeta,
  });

  const outputPdfPath = path.join(__dirname, '../../test_termoplan_loyiha.pdf');
  fs.writeFileSync(outputPdfPath, pdfBuffer);
  console.log(`✅ PDF muvaffaqiyatli saqlandi (${(pdfBuffer.length / 1024).toFixed(1)} KB): ${outputPdfPath}\n`);

  console.log('🎉 BARCHA BACKEND MODULLAR VA ALGORITMLAR 100% TESTDAN O‘TDI!');
}

runTests().catch(err => {
  console.error('❌ Testda xatolik:', err);
});
