const Call = require("../models/Call");

// GET /api/calls
exports.getCalls = async (req, res) => {
  try {
    const {
      outcome,
      brand,
      campaignId,
      customerId,
      search,
      page = 1,
      limit = 20,
    } = req.query;
    const filter = {};
    if (outcome && outcome !== "all") filter.outcome = outcome;
    if (brand) filter.brand = brand;
    if (campaignId) filter.campaignId = campaignId;
    if (customerId) filter.customerId = customerId;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { campaignName: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [calls, total] = await Promise.all([
      Call.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Call.countDocuments(filter),
    ]);
    res.json({
      success: true,
      data: calls,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/calls/:id
exports.getCallById = async (req, res) => {
    try {
        const call = await Call.findById(req.params.id);
        if (!call) return res.status(404).json({ success: false, message: 'Call not found' });
        res.json({ success: true, data: call });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/calls
exports.createCall = async (req, res) => {
  try {
    const call = await Call.create(req.body);
    res.status(201).json({ success: true, data: call });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/calls/:id
exports.updateCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!call)
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    res.json({ success: true, data: call });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/calls/stats — summary stats for dashboard
exports.getCallStats = async (req, res) => {
  try {
    const [total, booked, noAnswer, voicemail] = await Promise.all([
      Call.countDocuments(),
      Call.countDocuments({ outcome: "booked" }),
      Call.countDocuments({ outcome: "no_answer" }),
      Call.countDocuments({ outcome: "voicemail" }),
    ]);
    const durationAgg = await Call.aggregate([
      { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
    ]);
    const avgDuration = durationAgg[0]?.avgDuration || 0;
    res.json({
      success: true,
      data: {
        total,
        booked,
        noAnswer,
        voicemail,
        avgDuration: Math.round(avgDuration),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
