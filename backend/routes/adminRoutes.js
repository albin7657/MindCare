import express from "express";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import User from "../models/User.js";
import AssessmentType from "../models/AssessmentType.js";
import Category from "../models/Category.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get("/analytics", protect, admin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    // Risk distribution (Pie chart)
    const riskDistribution = await AssessmentAttempt.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.label",
          count: { $sum: 1 }
        }
      }
    ]);

    // Assessment types usage (Bar chart)
    const typeUsage = await AssessmentAttempt.aggregate([
      {
        $lookup: {
          from: "assessmenttypes",
          localField: "assessmentTypeId",
          foreignField: "_id",
          as: "type"
        }
      },
      { $unwind: "$type" },
      {
        $group: {
          _id: "$type.name",
          count: { $sum: 1 }
        }
      }
    ]);

    // Trend over time (Line chart)
    const trendData = await AssessmentAttempt.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalStudents,
      riskDistribution,
      typeUsage,
      trendData
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Admin Category CRUD
router.post("/category", protect, admin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
});

export default router;
