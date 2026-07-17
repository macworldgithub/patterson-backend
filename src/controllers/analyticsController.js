const Call = require('../models/Call');
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');

// GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalCampaigns,
            activeCampaigns,
            totalCustomers,
            totalCalls,
            bookedCalls,
            revenueAgg
        ] = await Promise.all([
            Campaign.countDocuments(),
            Campaign.countDocuments({ status: 'active' }),
            Customer.countDocuments(),
            Call.countDocuments(),
            Call.countDocuments({ outcome: 'booked' }),
            Campaign.aggregate([{ $group: { _id: null, total: { $sum: '$revenueImpact' } } }])
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;
        const answerRateAgg = await Call.aggregate([
            { $group: { _id: null, answered: { $sum: { $cond: [{ $in: ['$outcome', ['booked', 'not_interested', 'callback_requested', 'converted']] }, 1, 0] } }, total: { $sum: 1 } } }
        ]);
        const answerRate = answerRateAgg[0] ? ((answerRateAgg[0].answered / answerRateAgg[0].total) * 100).toFixed(1) : 0;
        const conversionRate = totalCalls > 0 ? ((bookedCalls / totalCalls) * 100).toFixed(1) : 0;
        res.json({
            success: true, data: {
                totalCampaigns, activeCampaigns, totalCustomers,
                totalCalls, bookedCalls, totalRevenue, answerRate, conversionRate
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/daily
exports.getDailyMetrics = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const since = new Date();
        since.setDate(since.getDate() - parseInt(days));
        const metrics = await Call.aggregate([
            { $match: { createdAt: { $gte: since } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    calls: { $sum: 1 },
                    answered: { $sum: { $cond: [{ $in: ['$outcome', ['booked', 'not_interested', 'callback_requested', 'converted']] }, 1, 0] } },
                    booked: { $sum: { $cond: [{ $eq: ['$outcome', 'booked'] }, 1, 0] } },
                    converted: { $sum: { $cond: [{ $eq: ['$outcome', 'converted'] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/by-location
exports.getLocationMetrics = async (req, res) => {
    try {
        const metrics = await Call.aggregate([
            { $group: { _id: '$dealershipLocation', calls: { $sum: 1 }, conversions: { $sum: { $cond: [{ $eq: ['$outcome', 'booked'] }, 1, 0] } } } },
            { $project: { location: '$_id', calls: 1, conversions: 1, _id: 0 } },
            { $sort: { calls: -1 } }
        ]);
        res.json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/by-brand
exports.getBrandMetrics = async (req, res) => {
    try {
        const metrics = await Campaign.aggregate([
            { $group: { _id: '$brand', campaigns: { $sum: 1 }, totalContacts: { $sum: '$totalContacts' }, conversions: { $sum: '$conversions' }, revenue: { $sum: '$revenueImpact' } } },
            { $project: { brand: '$_id', campaigns: 1, totalContacts: 1, conversions: 1, revenue: 1, _id: 0 } },
            { $sort: { revenue: -1 } }
        ]);
        res.json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/funnel
exports.getFunnelData = async (req, res) => {
    try {
        const [totalContacts, attempted, answered, booked, converted] = await Promise.all([
            Customer.countDocuments(),
            Call.countDocuments(),
            Call.countDocuments({ outcome: { $in: ['booked', 'not_interested', 'callback_requested', 'converted'] } }),
            Call.countDocuments({ outcome: 'booked' }),
            Call.countDocuments({ outcome: 'converted' })
        ]);
        const funnel = [
            { stage: 'Total Contacts', count: totalContacts, percentage: 100 },
            { stage: 'Attempted', count: attempted, percentage: totalContacts > 0 ? +((attempted / totalContacts) * 100).toFixed(1) : 0 },
            { stage: 'Answered', count: answered, percentage: totalContacts > 0 ? +((answered / totalContacts) * 100).toFixed(1) : 0 },
            { stage: 'Booked', count: booked, percentage: totalContacts > 0 ? +((booked / totalContacts) * 100).toFixed(1) : 0 },
            { stage: 'Converted', count: converted, percentage: totalContacts > 0 ? +((converted / totalContacts) * 100).toFixed(1) : 0 }
        ];
        res.json({ success: true, data: funnel });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};