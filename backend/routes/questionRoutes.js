import express from "express";
import Question from "../models/Question.js";
import Option from "../models/Option.js";

const router = express.Router();


// ====================================
// CREATE QUESTION (with options)
// ====================================
router.post("/", async (req, res) => {
  try {
    const { domain_id, question_text, weight } = req.body;

    if (!question_text) {
      return res.status(400).json({ error: "Question text is required" });
    }

    // Check if question already exists in this domain
    const existingQuestion = await Question.findOne({ domain_id, question_text });
    if (existingQuestion) {
      return res.status(400).json({ error: "This question already exists in this domain" });
    }

    const question = await Question.create(req.body);
    res.json(question);
  } catch (err) {
    res.status(500).json("Error creating question");
  }
});


// ====================================
// READ QUESTIONS BY DOMAIN
// ====================================
router.get("/domain/:domainId", async (req, res) => {
  try {
    const questions = await Question.find({
      domain_id: req.params.domainId
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json("Error fetching questions");
  }
});


// ====================================
// UPDATE QUESTION
// ====================================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json("Error updating question");
  }
});


// ====================================
// DELETE QUESTION (and its options)
// ====================================
router.delete("/:id", async (req, res) => {
  try {
    // Delete all options associated with this question
    await Option.deleteMany({ question_id: req.params.id });
    
    // Delete the question
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question and its options deleted" });
  } catch (err) {
    res.status(500).json("Error deleting question");
  }
});

export default router;
