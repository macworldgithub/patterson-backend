const Call = require("../models/Call");

// GET /api/calls
exports.getCalls = async (req, res) => {
  try {
    const {
      outcome,
      campaignId,
      customerId,
      search,
      page = 1,
      limit = 20,
    } = req.query;
    const filter = {};
    // Always scope to the logged-in user's branch
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    if (outcome && outcome !== "all") filter.outcome = outcome;
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
    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const call = await Call.findOne(filter);
    if (!call)
      return res
        .status(404)
        .json({ success: false, message: "Call not found" });
    res.json({ success: true, data: call });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/calls
exports.createCall = async (req, res) => {
  try {
    const callData = {
      ...req.body,
      userId: req.user?._id,
      branch: req.user?.branch,
    };
    const call = await Call.create(callData);
    res.status(201).json({ success: true, data: call });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/calls/:id
exports.updateCall = async (req, res) => {
  try {
    // Prevent branch from being changed
    delete req.body.branch;

    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const call = await Call.findOneAndUpdate(filter, req.body, {
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
    const filter = {};
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const [total, booked, noAnswer, voicemail] = await Promise.all([
      Call.countDocuments(filter),
      Call.countDocuments({ ...filter, outcome: "booked" }),
      Call.countDocuments({ ...filter, outcome: "no_answer" }),
      Call.countDocuments({ ...filter, outcome: "voicemail" }),
    ]);
    const durationAgg = await Call.aggregate([
      { $match: filter },
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
