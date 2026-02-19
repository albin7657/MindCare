import express from "express";
import Question from "../models/Question.js";
import Option from "../models/Option.js";

const router = express.Router();


// ====================================
// CREATE QUESTION (with options)
// ====================================
router.post("/", async (req, res) => {
  try {
    const { domain_id, assessment_type_id, question_text, weight } = req.body;

    if (!question_text) {
      return res.status(400).json({ error: "Question text is required" });
    }

    if (!assessment_type_id) {
      return res.status(400).json({ error: "Assessment type is required" });
    }

    // Check if question already exists in this domain AND assessment type
    const existingQuestion = await Question.findOne({ domain_id, assessment_type_id, question_text });
    if (existingQuestion) {
      return res.status(400).json({ error: "This question already exists in this domain for this assessment type" });
    }

    // allow weight to be specified but default to 1
    const question = await Question.create({ domain_id, assessment_type_id, question_text, weight: weight || 1 });
    res.json(question);
  } catch (err) {
    console.error('Question creation error', err);
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
    }).populate("assessment_type_id");

    res.json(questions);
  } catch (err) {
    res.status(500).json("Error fetching questions");
  }
});


// ====================================
// READ QUESTIONS BY DOMAIN AND ASSESSMENT TYPE
// ====================================
router.get("/domain/:domainId/assessment/:assessmentTypeId", async (req, res) => {
  try {
    const questions = await Question.find({
      domain_id: req.params.domainId,
      assessment_type_id: req.params.assessmentTypeId
    }).populate("assessment_type_id");

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
