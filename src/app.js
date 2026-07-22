// Local development entry point
// For Vercel deployment, the entry point is api/index.js

// DNS fix for local IPv4 resolution (dev only)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Import the shared app
const app = require("../api/index");

const PORT = process.env.PORT || 4030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));