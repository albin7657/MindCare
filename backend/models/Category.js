const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category_name: String,
  min_score: Number,
  max_score: Number
});

module.exports = mongoose.model("Category", CategorySchema);
