import express from "express";
import AssessmentAttempt from "../models/AssessementAttempt.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

const router = express.Router();

// Get all assessment attempts with aggregated scores by domain and assessment type
router.get("/", async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find()
      .populate("student_id")
      .populate("assessment_type_id");

    // For each attempt, get the answers and their points
    const attemptsWithScores = await Promise.all(
      attempts.map(async (attempt) => {
        const answers = await Answer.find({ attempt_id: attempt._id })
          .populate({
            path: "question_id",
            populate: "domain_id"
          });

        // Group answers by domain
        const scoresByDomain = {};
        answers.forEach(answer => {
          if (answer.question_id && answer.question_id.domain_id) {
            const domainId = answer.question_id.domain_id._id || answer.question_id.domain_id;
            if (!scoresByDomain[domainId]) {
              scoresByDomain[domainId] = 0;
            }
            scoresByDomain[domainId] += answer.points_awarded || 0;
          }
        });

        return {
          _id: attempt._id,
          student_id: attempt.student_id?._id,
          assessment_type_id: attempt.assessment_type_id?._id,
          attempt_date: attempt.attempt_date,
          status: attempt.status,
          scoresByDomain
        };
      })
    );

    res.json(attemptsWithScores);
  } catch (err) {
    console.error('Error fetching assessment attempts:', err);
    res.status(500).json({ error: "Error fetching assessment attempts" });
  }
});

// Get average scores by domain and assessment type
router.get("/analytics/averages", async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find()
      .populate("assessment_type_id");

    const scoreMap = {};

    // Aggregate scores for each domain + assessment type combination
    for (const attempt of attempts) {
      const assessmentTypeId = attempt.assessment_type_id?._id || attempt.assessment_type_id;
      
      const answers = await Answer.find({ attempt_id: attempt._id })
        .populate({
          path: "question_id",
          populate: "domain_id"
        });

      answers.forEach(answer => {
        if (answer.question_id && answer.question_id.domain_id) {
          const domainId = answer.question_id.domain_id._id || answer.question_id.domain_id;
          const key = `${domainId}-${assessmentTypeId}`;
          
          if (!scoreMap[key]) {
            scoreMap[key] = { scores: [], domainId, assessmentTypeId };
          }
          scoreMap[key].scores.push(answer.points_awarded || 0);
        }
      });
    }

    // Calculate averages
    const averages = {};
    Object.entries(scoreMap).forEach(([key, data]) => {
      const totalScore = data.scores.reduce((a, b) => a + b, 0);
      const avgScore = data.scores.length > 0 ? totalScore / data.scores.length : 0;
      averages[key] = avgScore;
    });

    res.json(averages);
  } catch (err) {
    console.error('Error calculating averages:', err);
    res.status(500).json({ error: "Error calculating averages" });
  }
});

export default router;
