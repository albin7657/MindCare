import express from "express";
import Domain from "../models/Domain.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET questions with options by multiple domain names (RESTORED FRONTEND ROUTE)
router.get("/questions-by-domains/:domainNames", async (req, res) => {
  try {
    const domainNamesStr = decodeURIComponent(req.params.domainNames);
    const domainNames = domainNamesStr.split(',').map(name => name.trim());

    // Find domains by names
    const domains = await Domain.find({ domain_name: { $in: domainNames } });
    if (domains.length === 0) {
      return res.status(404).json({ error: "No domains found" });
    }

    const domainIds = domains.map(d => d._id);

    // Find all questions in these domains
    const questions = await Question.find({ domain_id: { $in: domainIds } });

    // Transform to include options from OptionSet
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        let options = [];
        if (question.option_set_id) {
          options = await Option.find({ option_set_id: question.option_set_id }).sort({ order: 1 });
        } else {
          // Fallback if someone still uses question_id (legacy/migration)
          options = await Option.find({ question_id: question._id });
        }

        return {
          _id: question._id,
          question_text: question.question_text,
          domain_id: question.domain_id,
          assessment_type_id: question.assessment_type_id,
          weight: question.weight,
          options: options
        };
      })
    );

    res.json(questionsWithOptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// GET all domains
router.get("/", async (req, res) => {
  try {
    const domains = await Domain.find().populate("assessment_type_id");
    res.json(domains);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch domains" });
  }
});

// POST create new domain
router.post("/", protect, admin, async (req, res) => {
  try {
    const domain = new Domain(req.body);
    await domain.save();
    res.status(201).json(domain);
  } catch (err) {
    res.status(500).json({ message: "Failed to create domain" });
  }
});

// DELETE domain
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const domainId = req.params.id;

    // Find all questions in this domain
    const questions = await Question.find({ domain_id: domainId });
    const questionIds = questions.map(q => q._id);

    // Delete all options associated with these questions
    await Option.deleteMany({ question_id: { $in: questionIds } });

    // Delete all questions
    await Question.deleteMany({ domain_id: domainId });

    // Delete the domain
    await Domain.findByIdAndDelete(domainId);

    res.json({ message: "Domain and related data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete domain" });
  }
});

export default router;
