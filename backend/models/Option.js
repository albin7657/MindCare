import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  option_set_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OptionSet",
    required: true
  },

  option_text: {
    type: String,
    required: true
  },

  points: {
    type: Number,
    required: true
  },

  order: {
    type: Number,
    default: 0
  }});

export default mongoose.model("Option", OptionSchema);