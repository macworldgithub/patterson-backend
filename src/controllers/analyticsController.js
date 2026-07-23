const Call = require('../models/Call');
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');

// GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const filter = {};
        if (req.user && req.user.role !== "super_admin") {
            filter.userId = req.user._id;
        }
        const [
            totalCampaigns,
            activeCampaigns,
            totalCustomers,
            totalCalls,
            bookedCalls,
            revenueAgg
        ] = await Promise.all([
            Campaign.countDocuments(filter),
            Campaign.countDocuments({ ...filter, status: 'active' }),
            Customer.countDocuments(filter),
            Call.countDocuments(filter),
            Call.countDocuments({ ...filter, outcome: 'booked' }),
            Campaign.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$revenueImpact' } } }])
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;
        const answerRateAgg = await Call.aggregate([
            { $match: filter },
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
        const filter = { createdAt: { $gte: since } };
        if (req.user && req.user.role !== "super_admin") {
            filter.userId = req.user._id;
        }
        const metrics = await Call.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    calls: { $sum: 1 },
                    answered: { $sum: { $cond: [{ $in: ['$outcome', ['booked', 'not_interested', 'callback_requested', 'converted']] }, 1, 0] } },
                    booked: { $sum: { $cond: [{ $eq: ['$outcome', 'booked'] }, 1, 0] } },
                    converted: { $sum: { $cond: [{ $eq: ['$outcome', 'converted'] }, 1, 0] } },
                    revenue: { $sum: { $ifNull: ['$keyExtractions.dealValue', 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    calls: 1,
                    answered: 1,
                    booked: 1,
                    converted: 1,
                    revenue: 1,
                    answerRate: {
                        $cond: [{ $eq: ['$calls', 0] }, 0, { $multiply: [{ $divide: ['$answered', '$calls'] }, 100] }]
                    },
                    conversionRate: {
                        $cond: [{ $eq: ['$calls', 0] }, 0, { $multiply: [{ $divide: ['$booked', '$calls'] }, 100] }]
                    }
                }
            },
            { $sort: { date: 1 } }
        ]);

        const formattedMetrics = metrics.map(m => ({
            ...m,
            answerRate: parseFloat(m.answerRate.toFixed(1)),
            conversionRate: parseFloat(m.conversionRate.toFixed(1))
        }));

        res.json({ success: true, data: formattedMetrics });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/by-location
exports.getLocationMetrics = async (req, res) => {
    try {
        const matchStage = req.user && req.user.role !== "super_admin" ? [{ $match: { userId: req.user._id } }] : [];
        const metrics = await Call.aggregate([
            ...matchStage,
            {
                $group: {
                    _id: '$dealershipLocation',
                    calls: { $sum: 1 },
                    answered: { $sum: { $cond: [{ $in: ['$outcome', ['booked', 'not_interested', 'callback_requested', 'converted']] }, 1, 0] } },
                    conversions: { $sum: { $cond: [{ $eq: ['$outcome', 'booked'] }, 1, 0] } },
                    revenue: { $sum: { $ifNull: ['$keyExtractions.dealValue', 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    location: { $ifNull: ['$_id', 'Unknown'] },
                    calls: 1,
                    conversions: 1,
                    revenue: 1,
                    answerRate: {
                        $cond: [{ $eq: ['$calls', 0] }, 0, { $multiply: [{ $divide: ['$answered', '$calls'] }, 100] }]
                    }
                }
            },
            { $sort: { calls: -1 } }
        ]);

        const formattedMetrics = metrics.map(m => ({
            ...m,
            answerRate: parseFloat(m.answerRate.toFixed(1))
        }));

        res.json({ success: true, data: formattedMetrics });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/analytics/by-brand
exports.getBrandMetrics = async (req, res) => {
    try {
        const matchStage = req.user && req.user.role !== "super_admin" ? [{ $match: { userId: req.user._id } }] : [];
        const metrics = await Campaign.aggregate([
            ...matchStage,
            {
                $group: {
                    _id: '$brand',
                    campaigns: { $sum: 1 },
                    calls: { $sum: '$totalContacts' },
                    conversions: { $sum: '$conversions' },
                    revenue: { $sum: '$revenueImpact' }
                }
            },
            {
                $project: {
                    _id: 0,
                    brand: { $ifNull: ['$_id', 'Unknown'] },
                    campaigns: 1,
                    calls: 1,
                    conversions: 1,
                    revenue: 1,
                    avgUpgradeScore: { $literal: 0 }
                }
            },
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
        const filter = {};
        if (req.user && req.user.role !== "super_admin") {
            filter.userId = req.user._id;
        }
        const [totalContacts, attempted, answered, booked, converted] = await Promise.all([
            Customer.countDocuments(filter),
            Call.countDocuments(filter),
            Call.countDocuments({ ...filter, outcome: { $in: ['booked', 'not_interested', 'callback_requested', 'converted'] } }),
            Call.countDocuments({ ...filter, outcome: 'booked' }),
            Call.countDocuments({ ...filter, outcome: 'converted' })
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