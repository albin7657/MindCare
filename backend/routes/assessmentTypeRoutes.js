import express from "express";
import AssessmentType from "../models/AssessementType.js";

const router = express.Router();

// GET all assessment types
router.get("/", async (req, res) => {
  try {
    const assessmentTypes = await AssessmentType.find();
    res.json(assessmentTypes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assessment types" });
  }
});

// GET assessment type by ID
router.get("/:id", async (req, res) => {
  try {
    const assessmentType = await AssessmentType.findById(req.params.id);
    if (!assessmentType) {
      return res.status(404).json({ error: "Assessment type not found" });
    }
    res.json(assessmentType);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assessment type" });
  }
});

// POST create new assessment type
router.post("/", async (req, res) => {
  try {
    const { name, mode, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newAssessmentType = new AssessmentType({
      name,
      mode,
      description
    });

    const savedAssessmentType = await newAssessmentType.save();
    res.status(201).json(savedAssessmentType);
  } catch (err) {
    res.status(500).json({ error: "Failed to create assessment type" });
  }
});

export default router;
