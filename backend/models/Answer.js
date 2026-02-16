const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  attempt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssessmentAttempt"
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  selected_option: String,
  points_awarded: Number
});

module.exports = mongoose.model("Answer", AnswerSchema);
