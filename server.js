import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import apiRoutes from "./routes/api.js";
import { authenticateToken } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PESU API Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply authentication middleware to all API routes
app.use("/api", authenticateToken, apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.APP_ENV === "dev" ? err.message : "Internal server error",
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.APP_ENV || "dev"}`);
});

export default app;
