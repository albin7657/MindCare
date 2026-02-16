import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },

  option_text: String,

  points: Number
});

export default mongoose.model("Option", OptionSchema);
