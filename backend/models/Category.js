import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category_name: String,
  min_score: Number,
  max_score: Number
});

export default mongoose.model("Category", CategorySchema);
