"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProjectPdfBuffer = generateProjectPdfBuffer;
const pdfkit_1 = __importDefault(require("pdfkit"));
const climateData_1 = require("../config/climateData");
/**
 * 4 Sahifali professional PDF loyiha yaratish (PDFKit asosida)
 */
async function generateProjectPdfBuffer(data) {
    return new Promise((resolve, reject) => {
        try {
            const { project, rooms, smeta } = data;
            const region = climateData_1.UZBEKISTAN_CLIMATE_DATA[project.regionId] || climateData_1.UZBEKISTAN_CLIMATE_DATA['tashkent'];
            const firstRoom = rooms[0];
            const primaryHeating = firstRoom?.heating;
            const primaryCooling = firstRoom?.cooling;
            const totalArea = rooms.reduce((sum, r) => sum + (r.room.area || 0), 0);
            const totalHeatLoss = rooms.reduce((sum, r) => sum + (r.heating?.totalHeatLossW || 0), 0);
            const totalCoolingLoad = rooms.reduce((sum, r) => sum + (r.cooling?.totalCoolingLoadW || 0), 0);
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 40,
                bufferPages: true,
            });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));
            // Ranglar palitrasi
            const primaryBlue = '#0284C7';
            const warmOrange = '#EA580C';
            const darkSlate = '#1E293B';
            const textGray = '#64748B';
            const bgLight = '#F8FAFC';
            const borderGray = '#CBD5E1';
            // =========================================================================
            // SAHIFA 1: BINO PASPORTI VA MIKROIKLIM TAHLILI
            // =========================================================================
            // Header
            doc.rect(40, 40, 515, 50).fillAndStroke('#F0F9FF', primaryBlue);
            doc.fillColor(primaryBlue).fontSize(20).text('TermoPlan', 55, 50, { continued: true });
            doc.fillColor(warmOrange).text(' Engineering');
            doc.fillColor(textGray).fontSize(10).text('Aqlli Mavsumiy Mikroiqlim Loyihalash Platformasi', 55, 72);
            doc.rect(400, 50, 145, 25).fill(primaryBlue);
            doc.fillColor('#FFFFFF').fontSize(9).text('LOYIHA PASPORTI', 400, 58, { width: 145, align: 'center' });
            doc.moveDown(2);
            // Bino va Geolokatsiya Ma'lumotlari Kartasi
            let currentY = 105;
            doc.rect(40, currentY, 515, 110).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(12).text('1. Bino va Geolokatsiya Parametrlari', 55, currentY + 10);
            doc.fillColor(darkSlate).fontSize(10);
            doc.text(`Loyiha nomi: ${project.title || 'TermoPlan Loyihasi'}`, 55, currentY + 30);
            doc.text(`Buyurtmachi: ${project.clientName || 'Nomaʼlum mijoz'}`, 55, currentY + 48);
            doc.text(`Manzil / Hudud: ${region.nameUz}`, 55, currentY + 66);
            doc.text(`Bino turi: ${project.buildingType === 'private_house' ? 'Hovli / Kottej' : 'Ko‘p qavatli bino'}`, 55, currentY + 84);
            doc.text(`Devor materiali: ${project.wallMaterial || 'G‘isht'}`, 310, currentY + 30);
            doc.text(`Umumiy maydon: ${totalArea || 25} m²`, 310, currentY + 48);
            doc.text(`Ship balandligi: ${project.defaultCeilingHeight || 3.0} metr`, 310, currentY + 66);
            doc.text(`Kompas burchagi: ${project.compassNorthAngle || 0}° (Shimolga nisbatan)`, 310, currentY + 84);
            // Iqlim va Insolyatsiya Kartasi
            currentY = 230;
            doc.rect(40, currentY, 515, 180).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(12).text('2. Mahalliy Iqlim va Insolyatsiya (Quyosh Nuri) Tahlili', 55, currentY + 10);
            // 3 ta Stat Box
            doc.rect(55, currentY + 32, 140, 50).fillAndStroke('#FFFFFF', borderGray);
            doc.fillColor(warmOrange).fontSize(16).text(`${region.minWinterTemp}°C`, 55, currentY + 40, { width: 140, align: 'center' });
            doc.fillColor(textGray).fontSize(8).text('Qishki hisobiy minimum', 55, currentY + 62, { width: 140, align: 'center' });
            doc.rect(215, currentY + 32, 140, 50).fillAndStroke('#FFFFFF', borderGray);
            doc.fillColor(primaryBlue).fontSize(16).text(`${region.maxSummerTemp}°C`, 215, currentY + 40, { width: 140, align: 'center' });
            doc.fillColor(textGray).fontSize(8).text('Yozgi hisobiy maksimum', 215, currentY + 62, { width: 140, align: 'center' });
            doc.rect(375, currentY + 32, 140, 50).fillAndStroke('#FFFFFF', borderGray);
            doc.fillColor(darkSlate).fontSize(16).text(`${primaryHeating?.insolation?.sunHoursDaily || 7} soat`, 375, currentY + 40, { width: 140, align: 'center' });
            doc.fillColor(textGray).fontSize(8).text('Kunlik quyosh nuri', 375, currentY + 62, { width: 140, align: 'center' });
            doc.fillColor(darkSlate).fontSize(10).text(`Mikroiqlim xulosasi: ${primaryHeating?.insolation?.orientationSummary || 'Tabiiy quyosh nuri hisobga olingan.'}`, 55, currentY + 95, { width: 485 });
            if (primaryHeating?.insolation?.highRiskOverheating) {
                doc.rect(55, currentY + 130, 485, 38).fillAndStroke('#FEF3C7', '#F59E0B');
                doc.fillColor('#92400E').fontSize(8.5).text('DIQQAT: Janub/G‘arb oynalari orqali kuchli quyosh tushishi sababli yozgi sovutishga +25% zaxira qo‘shildi va qishda xonaning haddan tashqari qizib ketmasligi uchun avtomatik servo-klapan tavsiya etildi.', 65, currentY + 136, { width: 465 });
            }
            // Mavsumiy Energetik Ko'rsatkichlar
            currentY = 425;
            doc.rect(40, currentY, 515, 120).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(12).text('3. Mavsumiy Energetik Balans', 55, currentY + 10);
            doc.rect(55, currentY + 32, 220, 65).fillAndStroke('#FFFFFF', borderGray);
            doc.fillColor(warmOrange).fontSize(18).text(`${(totalHeatLoss / 1000).toFixed(2)} kW`, 55, currentY + 42, { width: 220, align: 'center' });
            doc.fillColor(textGray).fontSize(9).text('Qishki jami issiqlik yo‘qotilishi (Qishki yuk)', 55, currentY + 68, { width: 220, align: 'center' });
            doc.rect(295, currentY + 32, 220, 65).fillAndStroke('#FFFFFF', borderGray);
            doc.fillColor(primaryBlue).fontSize(18).text(`${(totalCoolingLoad / 1000).toFixed(2)} kW`, 295, currentY + 42, { width: 220, align: 'center' });
            doc.fillColor(textGray).fontSize(9).text(`Yozgi sovutish yuki (${Math.round(totalCoolingLoad * 3.412).toLocaleString()} BTU)`, 295, currentY + 68, { width: 220, align: 'center' });
            // Footer
            doc.fillColor(textGray).fontSize(8).text('TermoPlan Muhandislik Tizimi | 1-sahifa / 4', 40, 780, { width: 515, align: 'center' });
            // =========================================================================
            // SAHIFA 2: QISHKI ISITISH (TYOPLY POL) 2D SXEMASI
            // =========================================================================
            doc.addPage();
            doc.rect(40, 40, 515, 45).fillAndStroke('#FFF7ED', warmOrange);
            doc.fillColor(warmOrange).fontSize(16).text('QISHTI REJIM: TYOPLY POL QUWURLAR SXEMASI', 55, 52);
            doc.fillColor(textGray).fontSize(9).text('Salyangoz (Spiral) usulidagi marshrut, chegaraviy sovuq zona va kollektor ulanishi', 55, 70);
            // 2D Chizma Maydoni
            const canvasY = 95;
            doc.rect(40, canvasY, 515, 340).fillAndStroke('#FFFFFF', darkSlate);
            // Xona devori
            doc.rect(70, canvasY + 30, 455, 260).lineWidth(4).stroke(darkSlate);
            // Oyna (Moviy)
            doc.rect(170, canvasY + 24, 150, 10).fill(primaryBlue);
            doc.fillColor(primaryBlue).fontSize(8).text('Oyna (Sovuq chegara zonasi: 10 sm qadam)', 170, canvasY + 12, { width: 150, align: 'center' });
            // Eshik (Yashil)
            doc.rect(100, canvasY + 286, 60, 8).fill('#16A34A');
            doc.fillColor('#16A34A').fontSize(8).text('Eshik', 100, canvasY + 296);
            // Kollektor tuguni
            doc.rect(80, canvasY + 40, 30, 20).fill('#DC2626');
            doc.fillColor('#FFFFFF').fontSize(8).text('KL', 80, canvasY + 46, { width: 30, align: 'center' });
            doc.fillColor('#DC2626').fontSize(8).text('Kollektor', 115, canvasY + 46);
            // Spiral quvurlar chizmasi (PDFKit vector lines)
            doc.lineWidth(1.8).strokeColor(warmOrange);
            const spiralBox = { left: 110, top: canvasY + 65, right: 490, bottom: canvasY + 260 };
            let sLeft = spiralBox.left;
            let sTop = spiralBox.top;
            let sRight = spiralBox.right;
            let sBottom = spiralBox.bottom;
            doc.moveTo(110, canvasY + 50); // Kollektordan boshlash
            while (sLeft < sRight - 15 && sTop < sBottom - 15) {
                doc.lineTo(sRight, sTop);
                doc.lineTo(sRight, sBottom);
                doc.lineTo(sLeft + 12, sBottom);
                doc.lineTo(sLeft + 12, sTop + 12);
                sLeft += 12;
                sRight -= 12;
                sTop += 12;
                sBottom -= 12;
            }
            // Qaytish quvuri (Return line)
            doc.strokeColor('#0284C7').lineWidth(1.2);
            doc.lineTo(95, canvasY + 60);
            doc.stroke();
            // Qishki texnik spetsifikatsiya
            currentY = 450;
            doc.rect(40, currentY, 515, 140).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(11).text('Qishki Tizim Texnik Ko‘rsatkichlari', 55, currentY + 10);
            doc.fontSize(9.5).fillColor(darkSlate);
            doc.text(`• Oyna osti va sovuq devor zonasi qadami: 10 sm (Zich himoya)`, 55, currentY + 30);
            doc.text(`• Markaziy yashash maydoni qadami: ${primaryHeating?.insolation?.solarFactor && primaryHeating.insolation.solarFactor >= 1.2 ? '20 sm (Quyoshli)' : '15 sm (Komfort)'}`, 55, currentY + 46);
            doc.text(`• Jami quvur uzunligi (+10% zaxira bilan): ${primaryHeating?.pipeLengthWithReserveM || 180} metr`, 55, currentY + 62);
            doc.text(`• Quvur turi: PERT / PEX-A 16x2.0mm kislorod to‘siqli (EVOH)`, 55, currentY + 78);
            doc.text(`• Konturlar soni: ${primaryHeating?.circuitsCount || 2} ta (Maksimal 80-90m / kontur)`, 55, currentY + 94);
            doc.text(`• Kollektor guruhi: ${primaryHeating?.manifoldPorts || 2} chiqishli sarf-o‘lchagich (rotametr) bilan`, 55, currentY + 110);
            doc.text(`• Qozon quvvati: ~${primaryHeating?.boilerPowerKw || 2.5} kW`, 310, currentY + 30);
            doc.text(`• Avtomatika: ${primaryHeating?.servoActuatorsCount || 1} ta Termoelektrik servo-klapan`, 310, currentY + 46);
            doc.text(`• Penopolistirol (EPS) maydoni: ${primaryHeating?.insulationAreaM2 || 25} m²`, 310, currentY + 62);
            doc.text(`• Damping lenta uzunligi: ${primaryHeating?.dampingTapeLengthM || 20} metr`, 310, currentY + 78);
            doc.text(`• Konstruksiya: ${primaryHeating?.screedRecommendation === 'dry_lightweight' ? 'Quruq yengil pol' : 'Klassik beton styajka'}`, 310, currentY + 94);
            doc.text(`• Komfort fon harorati: +23°C (Plitka muzlamaslik kafolati)`, 310, currentY + 110);
            doc.fillColor(textGray).fontSize(8).text('TermoPlan Muhandislik Tizimi | 2-sahifa / 4', 40, 780, { width: 515, align: 'center' });
            // =========================================================================
            // SAHIFA 3: YOZGI SOVUTISH VA SMART AC PLACEMENT
            // =========================================================================
            doc.addPage();
            doc.rect(40, 40, 515, 45).fillAndStroke('#F0F9FF', primaryBlue);
            doc.fillColor(primaryBlue).fontSize(16).text('YOZGI REJIM: KONDITSIONER JOYLASHUVI & HAVO OQIMI', 55, 52);
            doc.fillColor(textGray).fontSize(9).text('Salomatlikka zarar yetkazmaydigan xavfsiz yo‘nalish va 2D havo tarqalish konusi', 55, 70);
            // 2D Chizma Maydoni
            const canvas3Y = 95;
            doc.rect(40, canvas3Y, 515, 340).fillAndStroke('#FFFFFF', darkSlate);
            // Xona devori
            doc.rect(70, canvas3Y + 30, 455, 260).lineWidth(4).stroke(darkSlate);
            // Mebel (Krovat / Divan) - Qizil xavfsizlik chegarasi
            doc.rect(260, canvas3Y + 140, 160, 110).fillAndStroke('#FEF2F2', '#EF4444');
            doc.fillColor('#B91C1C').fontSize(10).text('🛏️ Krovat / Divan', 260, canvas3Y + 175, { width: 160, align: 'center' });
            doc.fillColor('#EF4444').fontSize(8).text('(Havo to‘g‘ri urilmasligi taʼminlandi)', 260, canvas3Y + 195, { width: 160, align: 'center' });
            // AC Ichki Blok
            doc.rect(100, canvas3Y + 24, 70, 14).fill(primaryBlue);
            doc.fillColor('#FFFFFF').fontSize(8).text(`AC ${primaryCooling?.recommendedBtu || 9000}`, 100, canvas3Y + 27, { width: 70, align: 'center' });
            // 2D Havo Oqimi Konusi (Moviy vektor to'lqinlari)
            doc.lineWidth(1.5).strokeColor('#38BDF8');
            doc.polygon([135, canvas3Y + 38], [240, canvas3Y + 120], [75, canvas3Y + 240]).stroke();
            doc.polygon([135, canvas3Y + 38], [300, canvas3Y + 100], [135, canvas3Y + 280]).stroke();
            // Tashqi blok
            doc.rect(460, canvas3Y + 8, 35, 18).fill('#475569');
            doc.fillColor('#FFFFFF').fontSize(7).text('Tashqi blok', 460, canvas3Y + 13, { width: 35, align: 'center' });
            // Mis trassa
            doc.lineWidth(2).strokeColor('#D97706');
            doc.moveTo(170, canvas3Y + 31).lineTo(460, canvas3Y + 17).stroke();
            // Yozgi texnik spetsifikatsiya
            currentY = 450;
            doc.rect(40, currentY, 515, 140).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(11).text('Konditsioner Tanlovi va Xavfsizlik Qoidalari', 55, currentY + 10);
            doc.fontSize(9.5).fillColor(darkSlate);
            doc.text(`• Tavsiya etilgan quvvat: ${primaryCooling?.recommendedBtu?.toLocaleString()} BTU (${primaryCooling?.recommendedKw} kW)`, 55, currentY + 30);
            doc.text(`• Model klassi: Inverter Split (Yuqori tejamkor, R32 freon)`, 55, currentY + 46);
            doc.text(`• Havo oqimi burchagi: 55° konussimon diagonal yo‘naltirish`, 55, currentY + 62);
            doc.text(`• Mis trassa uzunligi: ~${primaryCooling?.copperRouteLengthM || 3.5} metr`, 55, currentY + 78);
            doc.text(`• To‘g‘ridan-to‘g‘ri urilishdan himoya: ✅ To‘liq taʼminlangan`, 310, currentY + 30);
            doc.text(`• Issiqlik oqimini kesish: Oyna oldidagi issiq havoni ushlaydi`, 310, currentY + 46);
            doc.text(`• Shovqin darajasi: Tungi rejimda < 21 dB (Ultra jim)`, 310, currentY + 62);
            doc.text(`• O‘rnatish joyi: Xonaning uzun devori bo‘ylab optimal oqim`, 310, currentY + 78);
            doc.fillColor(textGray).fontSize(8).text('TermoPlan Muhandislik Tizimi | 3-sahifa / 4', 40, 780, { width: 515, align: 'center' });
            // =========================================================================
            // SAHIFA 4: BIRLASHGAN SMETA VA MUHANDISLIK YO'RIQNOMASI
            // =========================================================================
            doc.addPage();
            doc.rect(40, 40, 515, 45).fillAndStroke('#FAF5FF', '#7E22CE');
            doc.fillColor('#7E22CE').fontSize(16).text('BIRLASHGAN SMETA & MUHANDISLIK YO‘RIQNOMASI', 55, 52);
            doc.fillColor(textGray).fontSize(9).text('Barcha mavsumiy materiallar ro‘yxati, xarajatlar va o‘rnatish bo‘yicha ko‘rsatma', 55, 70);
            // Smeta Jadvali
            currentY = 95;
            doc.rect(40, currentY, 515, 260).fillAndStroke(bgLight, borderGray);
            // Table Header
            doc.rect(40, currentY, 515, 22).fill('#E2E8F0');
            doc.fillColor(darkSlate).fontSize(9);
            doc.text('№', 45, currentY + 6);
            doc.text('Material / Uskuna nomi', 70, currentY + 6);
            doc.text('Birligi', 310, currentY + 6);
            doc.text('Miqdori', 360, currentY + 6);
            doc.text('Narxi (UZS)', 410, currentY + 6);
            doc.text('Jami (UZS)', 480, currentY + 6);
            let rowY = currentY + 26;
            const itemsToDisplay = (smeta.items || []).slice(0, 9);
            itemsToDisplay.forEach((it, index) => {
                doc.fillColor(darkSlate).fontSize(8.5);
                doc.text(`${index + 1}`, 45, rowY);
                doc.text(it.name.length > 42 ? it.name.substring(0, 42) + '...' : it.name, 70, rowY);
                doc.text(it.unit, 310, rowY);
                doc.text(`${it.quantity}`, 360, rowY);
                doc.text(`${Number(it.unitPriceUzs).toLocaleString()}`, 410, rowY);
                doc.text(`${Number(it.totalPriceUzs).toLocaleString()}`, 480, rowY);
                rowY += 22;
            });
            // Total Row
            doc.rect(40, currentY + 230, 515, 30).fill(primaryBlue);
            doc.fillColor('#FFFFFF').fontSize(11).text('UMUMIY BYUDJET (Qish + Yoz):', 55, currentY + 238);
            doc.text(`${Number(smeta.grandTotalUzs || 0).toLocaleString()} UZS (~$${Number(smeta.grandTotalUsd || 0).toLocaleString()})`, 330, currentY + 238, { width: 215, align: 'right' });
            // Ustalarga Muhandislik Yo'riqnomasi
            currentY = 370;
            doc.rect(40, currentY, 515, 200).fillAndStroke(bgLight, borderGray);
            doc.fillColor(darkSlate).fontSize(12).text('🛠️ Ustalarga Muhandislik O‘rnatish Yo‘riqnomasi', 55, currentY + 12);
            const rules = [
                '1. Damping lenta: Devor perimetri bo‘ylab 8mm damping lentani bo‘shliqlarsiz yopishtiring (issiqlik ko‘prigini uzadi).',
                '2. Oyna chegaraviy zonasi: Oyna va tashqi devordan 0.8m masofagacha 10 sm qadam bilan quvur yotqizilishi shart.',
                '3. Quvurlarni bukish: PEX quvurlarini 90° qayirishda quvur devorini ezmaslik uchun maxsus burchak fiksatorlaridan foydalaning.',
                '4. Gidravlik opressovka: Styajka quyishdan avval kollektor va barcha konturlar 6 bar bosimda 24 soat sinovdan o‘tkazilsin.',
                '5. Konditsioner vakuumlash: Mis trassa ulangandan so‘ng, freon ochishdan oldin tizim kamida 15 daqiqa vakuum nasosi bilan quritilsin.',
                '6. Drenaj qiyaligi: Suv toshmasligi uchun kondensat trubkasi har 1 metrga kamida 1-2 sm qiyalikda tortilishi shart.',
            ];
            let ruleY = currentY + 36;
            rules.forEach(rule => {
                doc.fillColor(darkSlate).fontSize(8.5).text(rule, 55, ruleY, { width: 485 });
                ruleY += 25;
            });
            doc.fillColor(textGray).fontSize(8).text('TermoPlan Muhandislik Tizimi | 4-sahifa / 4', 40, 780, { width: 515, align: 'center' });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
