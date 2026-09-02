"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmetaController = void 0;
const Smeta_1 = require("../models/Smeta");
class SmetaController {
    static async getProjectSmeta(req, res) {
        try {
            const { projectId } = req.params;
            const smeta = await Smeta_1.Smeta.findOne({ projectId });
            if (!smeta) {
                res.status(404).json({ success: false, message: 'Ushbu loyiha uchun smeta hali shakllantirilmagan' });
                return;
            }
            res.status(200).json({
                success: true,
                smeta,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async updateSmeta(req, res) {
        try {
            const { projectId } = req.params;
            const { items } = req.body;
            if (!items || !Array.isArray(items)) {
                res.status(400).json({ success: false, message: 'Smeta elementlari ro‘yxati talab qilinadi' });
                return;
            }
            let totalHeating = 0;
            let totalCooling = 0;
            let totalInstall = 0;
            const recalculatedItems = items.map((it) => {
                const itemTotal = it.quantity * it.unitPriceUzs;
                if (['heating', 'insulation', 'automation'].includes(it.category)) {
                    totalHeating += itemTotal;
                }
                else if (it.category === 'cooling') {
                    totalCooling += itemTotal;
                }
                else if (it.category === 'installation') {
                    totalInstall += itemTotal;
                }
                return {
                    ...it,
                    totalPriceUzs: itemTotal,
                };
            });
            const grandTotalUzs = totalHeating + totalCooling + totalInstall;
            const usdExchangeRate = 12850;
            const grandTotalUsd = Math.round(grandTotalUzs / usdExchangeRate);
            const smeta = await Smeta_1.Smeta.findOneAndUpdate({ projectId }, {
                items: recalculatedItems,
                totalHeatingCostUzs: totalHeating,
                totalCoolingCostUzs: totalCooling,
                totalInstallationCostUzs: totalInstall,
                grandTotalUzs,
                grandTotalUsd,
                usdExchangeRate,
            }, { new: true, upsert: true });
            res.status(200).json({
                success: true,
                message: 'Smeta va narxlar qayta hisoblandi va saqlandi',
                smeta,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.SmetaController = SmetaController;
