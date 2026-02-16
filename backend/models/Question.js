import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true
  },
  question_text: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    default: 1
  }
});

export default mongoose.model("Question", QuestionSchema);
