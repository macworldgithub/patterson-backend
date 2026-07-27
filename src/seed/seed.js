require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const Call = require("../models/Call");
const User = require("../models/User");
const Role = require("../models/Role");
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
    Role.deleteMany({}),
    Notification.deleteMany({}),
    Integration.deleteMany({}),
  ]);
  console.log("Cleared existing data.");

  // Seed Users (password: Patterson2026!)
  const users = await User.insertMany([
    {
      firstName: "Alex",
      lastName: "Harrison",
      email: "alex.harrison@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "super_admin",
      status: "active",
      dealership: "Group HQ",
      brand: "All Brands",
    },
    {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "admin",
      status: "active",
      dealership: "Toyota Keysborough",
      brand: "Toyota",
    },
    {
      firstName: "Tom",
      lastName: "Bradley",
      email: "tom.bradley@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "manager",
      status: "active",
      dealership: "Mercedes-Benz Berwick",
      brand: "Mercedes-Benz",
    },
    {
      firstName: "Jessica",
      lastName: "Park",
      email: "jessica.park@pattersoncheney.com.au",
      password: "Patterson2026!",
      role: "agent",
      status: "active",
      dealership: "Isuzu Dandenong",
      brand: "Isuzu UTE",
    },
  ]);
  console.log(`Seeded ${users.length} users.`);

  // Seed Campaigns
  const campaigns = await Campaign.insertMany([
    {
      name: "Toyota HiLux Service Reminder Q2 2026",
      type: "service_reminder",
      status: "active",
      brand: "Toyota",
      location: "Keysborough",
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
      name: "Mercedes GLC Upgrade Offer — June",
      type: "upgrade_offer",
      status: "active",
      brand: "Mercedes-Benz",
      location: "Berwick",
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
      script: "Good morning, I'm Aria from Patterson Cheney Mercedes-Benz...",
      tags: ["premium", "upgrade", "mercedes"],
    },
    {
      name: "Isuzu D-Max Finance Renewal",
      type: "finance_renewal",
      status: "paused",
      brand: "Isuzu UTE",
      location: "Dandenong",
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
      script: "Hi there, this is Max calling from Patterson Cheney Isuzu...",
      tags: ["finance", "isuzu", "renewal"],
    },
    {
      name: "RAV4 Hybrid Re-engagement — Churned",
      type: "reengagement",
      status: "completed",
      brand: "Toyota",
      location: "Chadstone",
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
      script: "Hi, I'm Aria from Patterson Cheney Chadstone Toyota...",
      tags: ["reengagement", "hybrid", "completed"],
    },
    {
      name: "Mahindra Scorpio-N Launch Outreach",
      type: "upgrade_offer",
      status: "scheduled",
      brand: "Mahindra",
      location: "Werribee",
      totalContacts: 290,
      contactsAttempted: 0,
      contactsReached: 0,
      bookings: 0,
      conversions: 0,
      conversionRate: 0,
      answerRate: 0,
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      scheduledTime: "10:00 AM - 5:00 PM",
      maxAttempts: 3,
      attemptsCompleted: 0,
      revenueImpact: 0,
      aiAgentName: "Aria",
      script: "Hi, this is Aria from Werribee Mahindra...",
      tags: ["launch", "mahindra", "new-model"],
    },
    {
      name: "Mercedes C-Class Winter Service Drive",
      type: "service_reminder",
      status: "draft",
      brand: "Mercedes-Benz",
      location: "Brighton",
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
        "Good morning, I'm Aria from Patterson Cheney Mercedes-Benz Brighton...",
      tags: ["winter", "service", "mercedes", "draft"],
    },
  ]);
  console.log(`Seeded ${campaigns.length} campaigns.`);

  // Seed Customers
  const customers = await Customer.insertMany([
    {
      firstName: "James",
      lastName: "Nguyen",
      email: "james.nguyen@gmail.com",
      phone: "(03) 9789 2341",
      mobilePhone: "0412 345 678",
      address: "14 Acacia Court",
      suburb: "Keysborough",
      state: "VIC",
      postcode: "3173",
      status: "active",
      upgradeScore: 5,
      brand: "Toyota",
      assignedDealership: "Patterson Cheney Toyota Keysborough",
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
      suburb: "Berwick",
      state: "VIC",
      postcode: "3806",
      status: "active",
      upgradeScore: 4,
      brand: "Mercedes-Benz",
      assignedDealership: "Mercedes-Benz Berwick",
      totalSpend: 94500,
      lifetimeValue: 142000,
      campaignHistory: [campaigns[1]._id],
      lastContactDate: "2026-06-18",
      preferredContactTime: "Afternoon",
      notes: "Expressed interest in GLC 43 AMG at last service.",
      doNotCall: false,
      tags: ["premium", "upgrade-interest", "amg-prospect"],
      vehicle: {
        make: "Mercedes-Benz",
        model: "GLC",
        year: 2022,
        variant: "300 SUV AMG Line",
        color: "Polar White",
        vin: "WDC2539571F456789",
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
      suburb: "Brighton",
      state: "VIC",
      postcode: "3186",
      status: "active",
      upgradeScore: 5,
      brand: "Mercedes-Benz",
      assignedDealership: "Mercedes-Benz Brighton",
      totalSpend: 86200,
      lifetimeValue: 168000,
      campaignHistory: [],
      lastContactDate: "2026-06-28",
      preferredContactTime: "Morning",
      notes:
        "Long-term customer — 3rd Mercedes. Finance ending Sep 26. Prime upgrade candidate.",
      doNotCall: false,
      tags: ["vip", "repeat-buyer", "finance-ending", "upgrade-ready"],
      vehicle: {
        make: "Mercedes-Benz",
        model: "C-Class",
        year: 2022,
        variant: "C 200 Sedan AMG Line",
        color: "Selenite Grey",
        vin: "WDD2050561R890123",
        regPlate: "JKL-987",
        odometer: 38700,
        purchaseDate: "2022-09-15",
        lastServiceDate: "2025-09-15",
        nextServiceDue: "2026-03-15",
        financeEndDate: "2026-09-15",
        warrantyExpiry: "2027-09-15",
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
      title: "Campaign Completed — RAV4 Re-engagement",
      message:
        "RAV4 Hybrid Re-engagement campaign completed. 61 conversions, $183K revenue impact.",
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
  console.log("Login: alex.harrison@pattersoncheney.com.au / Patterson2026!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
