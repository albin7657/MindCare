import express from "express";
import Question from "../models/Question.js";
import Option from "../models/Option.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET questions by domain (RESTORED FRONTEND COMPATIBILITY)
router.get("/domain/:domainId", async (req, res) => {
  try {
    const questions = await Question.find({ domain_id: req.params.domainId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Create question with options
router.post("/", protect, admin, async (req, res) => {
  try {
    const { domain_id, assessment_type_id, question_text, order, weight, options } = req.body;

    const question = new Question({ domain_id, assessment_type_id, question_text, order, weight });
    await question.save();

    if (options && Array.isArray(options)) {
      const optionDocs = options.map(opt => ({
        question_id: question._id,
        option_text: opt.option_text || opt.label, // Handle both formats
        points: opt.points || opt.value || 0
      }));
      await Option.insertMany(optionDocs);
    }

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating question" });
  }
});

// DELETE question
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    await Option.deleteMany({ question_id: req.params.id });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting question" });
  }
});

export default router;
