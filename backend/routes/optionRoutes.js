import express from "express";
import Option from "../models/Option.js";

const router = express.Router();

// GET options for question
router.get("/question/:id", async (req, res) => {
  const options = await Option.find({
    question_id: req.params.id
  });

  res.json(options);
});

// ADD option
router.post("/", async (req, res) => {
  try {
    const { question_id, points, option_text } = req.body;

    if (!question_id || points === undefined || !option_text) {
      return res.status(400).json({ error: "question_id, points, and option_text are required" });
    }

    // Check if option with same points already exists for this question
    const existingOption = await Option.findOne({ question_id, points });
    if (existingOption) {
      return res.status(400).json({ error: "An option with these points already exists for this question" });
    }

    const option = await Option.create(req.body);
    res.status(201).json(option);
  } catch (err) {
    res.status(500).json({ error: "Failed to create option" });
  }
});

// DELETE option
router.delete("/:id", async (req, res) => {
  await Option.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
