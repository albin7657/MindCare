import express from "express";
import Domain from "../models/Domain.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";

const router = express.Router();

// GET all domains
router.get("/", async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch domains" });
  }
});

// GET domain by ID
router.get("/:id", async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    res.json(domain);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch domain" });
  }
});

// POST create new domain
router.post("/", async (req, res) => {
  try {
    const { domain_name, color } = req.body;

    if (!domain_name) {
      return res.status(400).json({ error: "Domain name is required" });
    }

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ domain_name });
    if (existingDomain) {
      return res.status(400).json({ error: "Domain with this name already exists" });
    }

    const newDomain = new Domain({
      domain_name,
      color
    });

    const savedDomain = await newDomain.save();
    res.status(201).json(savedDomain);
  } catch (err) {
    res.status(500).json({ error: "Failed to create domain" });
  }
});

// PUT update domain
router.put("/:id", async (req, res) => {
  try {
    const { domain_name, color } = req.body;

    const updatedDomain = await Domain.findByIdAndUpdate(
      req.params.id,
      { domain_name, color },
      { new: true }
    );

    if (!updatedDomain) {
      return res.status(404).json({ error: "Domain not found" });
    }

    res.json(updatedDomain);
  } catch (err) {
    res.status(500).json({ error: "Failed to update domain" });
  }
});

// DELETE domain (and all its questions and options)
router.delete("/:id", async (req, res) => {
  try {
    const domainId = req.params.id;

    // Find all questions in this domain
    const questions = await Question.find({ domain_id: domainId });
    const questionIds = questions.map(q => q._id);

    // Delete all options for these questions
    await Option.deleteMany({ question_id: { $in: questionIds } });

    // Delete all questions in this domain
    await Question.deleteMany({ domain_id: domainId });

    // Delete the domain
    const deletedDomain = await Domain.findByIdAndDelete(domainId);

    if (!deletedDomain) {
      return res.status(404).json({ error: "Domain not found" });
    }

    res.json({ message: "Domain, questions, and options deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete domain" });
  }
});

export default router;
