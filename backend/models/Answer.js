import mongoose from "mongoose";

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

export default mongoose.model("Answer", AnswerSchema);
