import Category from "../Category.js";

/**
 * Maps a score to a category for a given assessment type.
 * @param {String} assessment_type_id 
 * @param {Number} score 
 */
export const getCategoryForScore = async (assessment_type_id, score) => {
  const categories = await Category.find({ assessment_type_id });

  for (const category of categories) {
    if (score >= category.min_score && score <= category.max_score) {
      return category;
    }
  }

  return null;
};