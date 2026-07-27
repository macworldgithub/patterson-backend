require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const Call = require("../models/Call");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Integration = require("../models/Integration");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/patterson-chenny-crm";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  // Clear existing
  await Promise.all([
    Campaign.deleteMany({}),
    Customer.deleteMany({}),
    Call.deleteMany({}),
    User.deleteMany({}),
    Notification.deleteMany({}),
    Integration.deleteMany({}),
  ]);
  console.log("Cleared existing data.");

  // Seed Users — all are admins, scoped to their branch
  // Password for all: Patterson2026!
  const users = await User.insertMany([
    {
      firstName: "Alex",
      lastName: "Harrison",
      email: "alex.harrison@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "admin",
      status: "active",
      branch: "Keysborough",
    },
    {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "admin",
      status: "active",
      branch: "Keysborough",
    },
    {
      firstName: "Tom",
      lastName: "Bradley",
      email: "tom.bradley@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "admin",
      status: "active",
      branch: "Dandenong",
    },
    {
      firstName: "Jessica",
      lastName: "Park",
      email: "jessica.park@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "admin",
      status: "active",
      branch: "Ringwood",
    },
  ]);
  console.log(`Seeded ${users.length} users.`);

  // Seed Campaigns — each with a branch
  const campaigns = await Campaign.insertMany([
    {
      name: "Toyota HiLux Service Reminder Q2 2026",
      type: "service_reminder",
      status: "active",
      brand: "Toyota",
      location: "Keysborough",
      branch: "Keysborough",
      totalContacts: 1240,
      contactsAttempted: 876,
      contactsReached: 612,
      bookings: 134,
      conversions: 98,
      conversionRate: 15.9,
      answerRate: 69.9,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      scheduledTime: "10:00 AM - 6:00 PM",
      maxAttempts: 3,
      attemptsCompleted: 876,
      revenueImpact: 294000,
      aiAgentName: "Aria",
      script:
        "Hi, this is Aria calling from Patterson Cheney Toyota Keysborough...",
      tags: ["high-value", "service", "Q2"],
    },
    {
      name: "RAV4 Hybrid Upgrade Offer — June",
      type: "upgrade_offer",
      status: "active",
      brand: "Toyota",
      location: "Keysborough",
      branch: "Keysborough",
      totalContacts: 480,
      contactsAttempted: 360,
      contactsReached: 228,
      bookings: 42,
      conversions: 31,
      conversionRate: 13.6,
      answerRate: 63.3,
      startDate: "2026-06-10",
      endDate: "2026-07-10",
      scheduledTime: "11:00 AM - 7:00 PM",
      maxAttempts: 3,
      attemptsCompleted: 360,
      revenueImpact: 1116000,
      aiAgentName: "Aria",
      script: "Good morning, I'm Aria from Patterson Cheney Toyota Keysborough...",
      tags: ["premium", "upgrade", "rav4"],
    },
    {
      name: "Isuzu D-Max Finance Renewal",
      type: "finance_renewal",
      status: "paused",
      brand: "Isuzu UTE",
      location: "Dandenong",
      branch: "Dandenong",
      totalContacts: 320,
      contactsAttempted: 210,
      contactsReached: 144,
      bookings: 28,
      conversions: 19,
      conversionRate: 13.2,
      answerRate: 68.6,
      startDate: "2026-05-20",
      endDate: "2026-06-20",
      scheduledTime: "09:00 AM - 5:00 PM",
      maxAttempts: 2,
      attemptsCompleted: 210,
      revenueImpact: 570000,
      aiAgentName: "Max",
      script: "Hi there, this is Max calling from Patterson Cheney Isuzu Dandenong...",
      tags: ["finance", "isuzu", "renewal"],
    },
    {
      name: "Mitsubishi Triton Re-engagement — Churned",
      type: "reengagement",
      status: "completed",
      brand: "Mitsubishi",
      location: "Ringwood",
      branch: "Ringwood",
      totalContacts: 650,
      contactsAttempted: 650,
      contactsReached: 410,
      bookings: 88,
      conversions: 61,
      conversionRate: 14.9,
      answerRate: 63.1,
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      scheduledTime: "10:00 AM - 6:00 PM",
      maxAttempts: 3,
      attemptsCompleted: 650,
      revenueImpact: 183000,
      aiAgentName: "Aria",
      script: "Hi, I'm Aria from Patterson Cheney Ringwood...",
      tags: ["reengagement", "triton", "completed"],
    },
    {
      name: "Toyota LandCruiser Winter Service Drive",
      type: "service_reminder",
      status: "draft",
      brand: "Toyota",
      location: "Keysborough",
      branch: "Keysborough",
      totalContacts: 380,
      contactsAttempted: 0,
      contactsReached: 0,
      bookings: 0,
      conversions: 0,
      conversionRate: 0,
      answerRate: 0,
      startDate: "2026-07-15",
      endDate: "2026-08-15",
      scheduledTime: "10:00 AM - 6:00 PM",
      maxAttempts: 2,
      attemptsCompleted: 0,
      revenueImpact: 0,
      aiAgentName: "Aria",
      script:
        "Good morning, I'm Aria from Patterson Cheney Toyota Keysborough...",
      tags: ["winter", "service", "landcruiser", "draft"],
    },
  ]);
  console.log(`Seeded ${campaigns.length} campaigns.`);

  // Seed Customers — each with a branch (suburb is where they live, branch is the dealership)
  const customers = await Customer.insertMany([
    {
      firstName: "James",
      lastName: "Nguyen",
      email: "james.nguyen@gmail.com",
      phone: "(03) 9789 2341",
      mobilePhone: "0412 345 678",
      address: "14 Acacia Court",
      suburb: "Clayton",
      state: "VIC",
      postcode: "3168",
      status: "active",
      upgradeScore: 5,
      brand: "Toyota",
      assignedDealership: "Patterson Cheney Toyota Keysborough",
      branch: "Keysborough",
      totalSpend: 72400,
      lifetimeValue: 98000,
      campaignHistory: [campaigns[0]._id],
      lastContactDate: "2026-06-22",
      preferredContactTime: "Morning",
      notes: "High-value customer, interested in new HiLux Rogue upgrade.",
      doNotCall: false,
      tags: ["high-value", "upgrade-ready", "finance-ending"],
      vehicle: {
        make: "Toyota",
        model: "HiLux",
        year: 2021,
        variant: "SR5 4x4 Double Cab",
        color: "Graphite",
        vin: "MR0FR8CD9M0123456",
        regPlate: "ABC-123",
        odometer: 68200,
        purchaseDate: "2021-04-15",
        lastServiceDate: "2025-10-20",
        nextServiceDue: "2026-04-20",
        financeEndDate: "2026-10-15",
        warrantyExpiry: "2027-04-15",
      },
    },
    {
      firstName: "Sarah",
      lastName: "Thompson",
      email: "s.thompson@hotmail.com",
      phone: "(03) 9554 8812",
      mobilePhone: "0433 876 543",
      address: "3/82 Canterbury Road",
      suburb: "Springvale",
      state: "VIC",
      postcode: "3171",
      status: "active",
      upgradeScore: 4,
      brand: "Toyota",
      assignedDealership: "Patterson Cheney Toyota Keysborough",
      branch: "Keysborough",
      totalSpend: 94500,
      lifetimeValue: 142000,
      campaignHistory: [campaigns[1]._id],
      lastContactDate: "2026-06-18",
      preferredContactTime: "Afternoon",
      notes: "Expressed interest in RAV4 Hybrid at last service.",
      doNotCall: false,
      tags: ["premium", "upgrade-interest", "rav4-prospect"],
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        variant: "Ascent Sport Hybrid",
        color: "Lunar White",
        vin: "6T1KU4EE6M0456789",
        regPlate: "XYZ-789",
        odometer: 42100,
        purchaseDate: "2022-03-10",
        lastServiceDate: "2025-09-10",
        nextServiceDue: "2026-03-10",
        financeEndDate: "2027-03-10",
        warrantyExpiry: "2027-03-10",
      },
    },
    {
      firstName: "Emma",
      lastName: "Chen",
      email: "emma.chen@gmail.com",
      phone: "(03) 9593 7712",
      mobilePhone: "0425 678 901",
      address: "8 Marine Parade",
      suburb: "Dandenong",
      state: "VIC",
      postcode: "3175",
      status: "active",
      upgradeScore: 5,
      brand: "Isuzu UTE",
      assignedDealership: "Patterson Cheney Isuzu Dandenong",
      branch: "Dandenong",
      totalSpend: 86200,
      lifetimeValue: 168000,
      campaignHistory: [campaigns[2]._id],
      lastContactDate: "2026-06-28",
      preferredContactTime: "Morning",
      notes:
        "Long-term customer — 2nd D-Max. Finance ending Sep 26. Prime upgrade candidate.",
      doNotCall: false,
      tags: ["vip", "repeat-buyer", "finance-ending", "upgrade-ready"],
      vehicle: {
        make: "Isuzu",
        model: "D-Max",
        year: 2022,
        variant: "LS-U 4x4 Crew Cab",
        color: "Obsidian Grey",
        vin: "JACDPS16M7K890123",
        regPlate: "JKL-987",
        odometer: 38700,
        purchaseDate: "2022-09-15",
        lastServiceDate: "2025-09-15",
        nextServiceDue: "2026-03-15",
        financeEndDate: "2026-09-15",
        warrantyExpiry: "2027-09-15",
      },
    },
    {
      firstName: "Marcus",
      lastName: "Williams",
      email: "marcus.w@outlook.com",
      phone: "(03) 9730 5544",
      mobilePhone: "0411 222 333",
      address: "5 Sherwood Court",
      suburb: "Croydon",
      state: "VIC",
      postcode: "3136",
      status: "active",
      upgradeScore: 3,
      brand: "Mitsubishi",
      assignedDealership: "Patterson Cheney Ringwood",
      branch: "Ringwood",
      totalSpend: 45000,
      lifetimeValue: 62000,
      campaignHistory: [campaigns[3]._id],
      lastContactDate: "2026-05-20",
      preferredContactTime: "Evening",
      notes: "Interested in Triton upgrade. Prefers contact after 5pm.",
      doNotCall: false,
      tags: ["upgrade-interest", "triton"],
      vehicle: {
        make: "Mitsubishi",
        model: "Triton",
        year: 2020,
        variant: "GLS Premium 4WD",
        color: "White Diamond",
        vin: "MMBJNKB40LH112233",
        regPlate: "MNO-456",
        odometer: 72000,
        purchaseDate: "2020-08-01",
        lastServiceDate: "2025-08-01",
        nextServiceDue: "2026-02-01",
        financeEndDate: "2026-08-01",
        warrantyExpiry: "2025-08-01",
      },
    },
  ]);
  console.log(`Seeded ${customers.length} customers.`);

  // Seed Notifications
  await Notification.insertMany([
    {
      type: "booking",
      title: "New Booking — James Nguyen",
      message:
        "Service booking confirmed for 4 Apr 2026 at 10:00am. Toyota HiLux SR5.",
      read: false,
      actionUrl: "/calls",
      relatedId: customers[0]._id.toString(),
    },
    {
      type: "upgrade_alert",
      title: "High Upgrade Score — Emma Chen",
      message:
        "Emma Chen has an upgrade score of 5/5. Finance ends Sep 2026. Prime candidate.",
      read: false,
      actionUrl: `/customers/${customers[2]._id}`,
      relatedId: customers[2]._id.toString(),
    },
    {
      type: "campaign_complete",
      title: "Campaign Completed — Triton Re-engagement",
      message:
        "Mitsubishi Triton Re-engagement campaign completed. 61 conversions, $183K revenue impact.",
      read: true,
      actionUrl: `/campaigns/${campaigns[3]._id}`,
      relatedId: campaigns[3]._id.toString(),
    },
    {
      type: "error",
      title: "Integration Error — Google Sheets",
      message:
        "Google Sheets sync failed. Last successful sync: 2 hours ago. Check API credentials.",
      read: false,
      actionUrl: "/integrations",
    },
  ]);
  console.log("Seeded notifications.");

  // Seed Integrations
  await Integration.insertMany([
    {
      name: "Google Sheets",
      description: "Sync customer data from Google Sheets in real-time.",
      logo: "sheets",
      status: "error",
      lastSync: new Date(),
    },
    {
      name: "Retell AI",
      description: "Power AI voice agents with Retell's conversational AI.",
      logo: "retell",
      status: "connected",
      lastSync: new Date(),
    },
    {
      name: "Vapi",
      description: "Alternative voice AI provider for outbound calling.",
      logo: "vapi",
      status: "disconnected",
    },
    {
      name: "Slack",
      description: "Send booking notifications and alerts to Slack channels.",
      logo: "slack",
      status: "connected",
      lastSync: new Date(),
    },
    {
      name: "Microsoft Teams",
      description: "Post campaign updates and alerts to Teams channels.",
      logo: "teams",
      status: "disconnected",
    },
    {
      name: "Email (SMTP)",
      description: "Send confirmation emails and summaries via SMTP.",
      logo: "email",
      status: "connected",
      lastSync: new Date(),
    },
  ]);
  console.log("Seeded integrations.");

  console.log("\n✅ Seed complete!");
  console.log("Login credentials:");
  console.log("  Keysborough: alex.harrison@pattersoncheney.com.au / Patterson2026!");
  console.log("  Dandenong:   tom.bradley@pattersoncheney.com.au / Patterson2026!");
  console.log("  Ringwood:    jessica.park@pattersoncheney.com.au / Patterson2026!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
