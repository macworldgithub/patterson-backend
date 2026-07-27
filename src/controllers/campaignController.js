const Campaign = require("../models/Campaign");
const AuditLog = require("../models/AuditLog");

// GET /api/campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const filter = {};
    // Always scope to the logged-in user's branch
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    if (status && status !== "all") filter.status = status;
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: "i" };

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns, count: campaigns.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/campaigns/:id
exports.getCampaignById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const campaign = await Campaign.findOne(filter);
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/campaigns
exports.createCampaign = async (req, res) => {
  try {
    // Automatically assign branch and userId from the authenticated user
    const campaignData = {
      ...req.body,
      userId: req.user?._id,
      branch: req.user?.branch,
    };
    const campaign = await Campaign.create(campaignData);
    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.fullName || "System",
      action: "created",
      resource: "Campaign",
      resourceId: campaign._id.toString(),
      resourceName: campaign.name,
      details: `Campaign created with ${campaign.totalContacts} contacts.`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      severity: "info",
    });
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/campaigns/:id
exports.updateCampaign = async (req, res) => {
  try {
    // Prevent branch from being changed via update
    delete req.body.branch;

    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const campaign = await Campaign.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.fullName || "System",
      action: "updated",
      resource: "Campaign",
      resourceId: campaign._id.toString(),
      resourceName: campaign.name,
      details: `Campaign updated.`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      severity: "info",
    });
    res.json({ success: true, data: campaign });
  } catch (err) {
    const statusCode =
      err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

// PATCH /api/campaigns/:id/status
exports.updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const campaign = await Campaign.findOneAndUpdate(
      filter,
      { status },
      { new: true, runValidators: true },
    );
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    const action =
      status === "active"
        ? "campaign_started"
        : status === "paused"
          ? "campaign_paused"
          : "updated";
    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.fullName || "System",
      action,
      resource: "Campaign",
      resourceId: campaign._id.toString(),
      resourceName: campaign.name,
      details: `Campaign status changed to ${status}.`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      severity: status === "paused" ? "warning" : "info",
    });
    res.json({ success: true, data: campaign });
  } catch (err) {
    const statusCode =
      err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

// DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user && req.user.branch) {
      filter.branch = req.user.branch;
    }
    const campaign = await Campaign.findOneAndDelete(filter);
    if (!campaign)
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.fullName || "System",
      action: "deleted",
      resource: "Campaign",
      resourceId: req.params.id,
      resourceName: campaign.name,
      details: `Campaign deleted.`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      severity: "warning",
    });
    res.json({ success: true, message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
