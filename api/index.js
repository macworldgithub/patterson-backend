// Vercel serverless entry point
// This file re-exports the Express app for Vercel's serverless runtime

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("../src/config/db");
const errorHandler = require("../src/middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../src/config/swagger");

// Connect to MongoDB (connection is cached across invocations)
connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Patterson Cheney CRM API Docs",
    customCss:
      ".swagger-ui .topbar { background-color: #0C1E3C; } .swagger-ui .topbar .download-url-wrapper { display: none; }",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: "none",
    },
  })
);

// Serve raw OpenAPI JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Patterson Cheney CRM API running" })
);

// Routes
app.use("/api/campaigns", require("../src/routes/campaigns"));
app.use("/api/customers", require("../src/routes/customers"));
app.use("/api/calls", require("../src/routes/calls"));
app.use("/api/users", require("../src/routes/users"));
app.use("/api/auth", require("../src/routes/users"));
app.use("/api/analytics", require("../src/routes/analytics"));
app.use("/api/notifications", require("../src/routes/notifications"));
app.use("/api/audit-logs", require("../src/routes/auditLogs"));
app.use("/api/integrations", require("../src/routes/integrations"));
app.use("/api/simulation", require("../src/routes/simulation"));

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
