const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  attempt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssessmentAttempt"
  },
  total_score: Number,
  risk_level: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = mongoose.model("Score", ScoreSchema);
