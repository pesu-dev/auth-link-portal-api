import express from "express";
import Link from "../models/Link.js";
import Student from "../models/Student.js";

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

    const exists = await Link.prnExists(prn);

    res.json({
      success: true,
      data: {
        prn,
        exists: !!exists,
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

    const student = await Student.createOrUpdateStudentRecord(studentData);

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

    const linkRecord = await Link.createLinkRecord(userId, prn);

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
