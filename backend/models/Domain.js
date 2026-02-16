const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema({
  domain_name: String,
  assessment_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssessmentType"
  }
});

module.exports = mongoose.model("Domain", DomainSchema);
