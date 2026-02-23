import express from "express";
import Option from "../models/Option.js";

const router = express.Router();

// GET options for an option set
router.get("/set/:optionSetId", async (req, res) => {
  try {
    const options = await Option.find({
      option_set_id: req.params.optionSetId
    }).sort({ order: 1 });

    res.json(options);
  } catch (err) {
    res.status(500).json({ error: "Error fetching options" });
  }
});

// ADD option to an option set
router.post("/", async (req, res) => {
  try {
    const { option_set_id, points, option_text, order } = req.body;

    if (!option_set_id || points === undefined || !option_text) {
      return res.status(400).json({ error: "option_set_id, points, and option_text are required" });
    }

    // Check if option with same points already exists in this set
    const existingOption = await Option.findOne({ option_set_id, points });
    if (existingOption) {
      return res.status(400).json({ error: "An option with these points already exists in this option set" });
    }

    const option = await Option.create({
      option_set_id,
      points,
      option_text,
      order: order || 0
    });
    res.status(201).json(option);
  } catch (err) {
    res.status(500).json({ error: "Error creating option" });
  }
});

// UPDATE option
router.put("/:id", async (req, res) => {
  try {
    const updated = await Option.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Option not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating option" });
  }
});

// DELETE option
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Option.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Option not found" });
    }

    res.json({ message: "Option deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting option" });
  }});

export default router;