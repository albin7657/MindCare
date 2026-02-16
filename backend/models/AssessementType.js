const mongoose = require("mongoose");

const AssessmentTypeSchema = new mongoose.Schema({
  name: String,
  mode: String,
  description: String
});

module.exports = mongoose.model("AssessmentType", AssessmentTypeSchema);
