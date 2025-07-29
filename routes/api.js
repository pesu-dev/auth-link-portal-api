import express from "express";
import db from "../config/database.js";

const router = express.Router();

// GET /api/check-prn/:prn - Check if PRN exists
router.get("/check-prn/:prn", async (req, res) => {
  try {
    const { prn } = req.params;

    if (!prn) {
      return res.status(400).json({
        success: false,
        message: "PRN parameter is required",
      });
    }

    const exists = await db.link.findUnique({
      where: {
        prn,
      },
    });

    res.json({
      success: true,
      data: {
        prn,
        exists: exists !== null,
      },
    });
  } catch (error) {
    console.error("Error checking PRN:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// POST /api/student - Create or update student record
router.post("/student", async (req, res) => {
  try {
    const studentData = req.body;

    // Validate required fields
    const requiredFields = ["prn", "branch", "year", "campus"];
    const missingFields = requiredFields.filter((field) => !studentData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate nested required fields
    if (!studentData.branch.full || !studentData.branch.short) {
      return res.status(400).json({
        success: false,
        message: "Branch full and short names are required",
      });
    }

    if (!studentData.campus.code || !studentData.campus.short) {
      return res.status(400).json({
        success: false,
        message: "Campus code and short name are required",
      });
    }

    const student = await db.student.upsert({
      where: {
        prn: studentData.prn,
      },
      update: studentData,
      create: studentData,
    });

    res.json({
      success: true,
      data: student,
      message: "Student record created/updated successfully",
    });
  } catch (error) {
    console.error("Error creating/updating student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// POST /api/link - Create link record
router.post("/link", async (req, res) => {
  try {
    const { userId, prn } = req.body;

    if (!userId || !prn) {
      return res.status(400).json({
        success: false,
        message: "userId and prn are required",
      });
    }

    const linkRecord = await db.link.upsert({
      where: {
        userId_prn: {
          userId,
          prn,
        },
      },
      update: {
        linkedAt: new Date(),
      },
      create: {
        userId,
        prn,
        linkedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: linkRecord,
      message: "Link record created successfully",
    });
  } catch (error) {
    console.error("Error creating link record:", error);

    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Link record already exists for this user and PRN combination",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
