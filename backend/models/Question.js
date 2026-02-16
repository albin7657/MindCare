const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question_text: String,
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain"
  },
  options: [
    { option_text: String, points: Number }
  ]
});

module.exports = mongoose.model("Question", QuestionSchema);
