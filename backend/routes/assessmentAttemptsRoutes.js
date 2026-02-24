import express from "express";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import Answer from "../models/Answer.js";
import Option from "../models/Option.js";
import User from "../models/User.js";
import AssessmentType from "../models/AssessmentType.js";
import { protect } from "../middleware/authMiddleware.js";
import Domain from "../models/Domain.js";
import Question from "../models/Question.js";
import Score from "../models/Score.js";

const router = express.Router();

// @desc    Get student's assessment history
router.get("/history", protect, async (req, res) => {
  try {
    const history = await AssessmentAttempt.find({ student_id: req.user._id })
      .populate("assessment_type_id")
      .populate("category_id")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// @desc    Submit assessment attempt
router.post("/", async (req, res) => {
  try {
    const { user, answers: screenAnswers, assessment_type_id } = req.body;

    if (!screenAnswers) {
      throw new Error('Answers are missing from request body');
    }

    let studentId;
    if (user && user._id) {
      studentId = user._id;
    } else {
      const anon = await User.findOne({ email: "guest@mindcare.com" });
      studentId = anon ? anon._id : null;
      if (!studentId) {
        const guest = new User({
          name: "Guest",
          email: "guest@mindcare.com",
          password: "guestpassword",
          role: "student"
        });
        await guest.save();
        studentId = guest._id;
      }
    }

    // Flatten answers from screens
    const allAnswers = {
      ...(screenAnswers.screen1 || {}),
      ...(screenAnswers.screen2 || {}),
      ...(screenAnswers.screen3 || {})
    };

    const questionIds = Object.keys(allAnswers);
    const questions = await Question.find({ _id: { $in: questionIds } }).populate("domain_id");

    // Group answers by domain
    const domainData = {};
    for (const q of questions) {
      if (!q.domain_id) {
        console.warn(`Question ${q._id} has no domain_id`);
        continue;
      }

      const d = q.domain_id;
      const domainId = (d._id || d).toString();
      const domainName = d.domain_name || "General";

      if (!domainData[domainId]) {
        domainData[domainId] = {
          domain_id: domainId,
          domain_name: domainName,
          questions: [],
          total_points: 0,
          max_points: 0
        };
      }

      const answer = allAnswers[q._id.toString()];
      if (!answer) continue;

      domainData[domainId].questions.push({
        question_id: q._id,
        points: answer.points,
        option_id: answer.option_id
      });

      domainData[domainId].total_points += (answer.points || 0);

      const options = await Option.find({
        $or: [{ option_set_id: q.option_set_id }, { question_id: q._id }]
      });
      const maxQPoints = Math.max(...options.map(o => o.points || 0), 0);
      domainData[domainId].max_points += maxQPoints;
    }

    // Calculate domain scores and normalized scores
    const domain_scores = Object.values(domainData).map(d => ({
      domain_id: d.domain_id,
      domain_name: d.domain_name,
      score: d.total_points,
      max_score: d.max_points,
      normalized_score: d.max_points > 0 ? (d.total_points / d.max_points) * 100 : 0
    }));

    const total_score = domain_scores.reduce((sum, d) => sum + d.score, 0);
    const maximum_total_score = domain_scores.reduce((sum, d) => sum + d.max_score, 0);
    const overall_normalized_score = maximum_total_score > 0 ? (total_score / maximum_total_score) * 100 : 0;

    let risk_level = "Low Risk";
    if (overall_normalized_score >= 70) risk_level = "High Risk";
    else if (overall_normalized_score >= 40) risk_level = "Medium Risk";

    const recommendations = [];
    domain_scores.forEach(ds => {
      if (ds.normalized_score >= 70) {
        recommendations.push({
          test_name: ds.domain_name,
          reason: `We've noticed a high risk in your ${ds.domain_name} score (${ds.normalized_score.toFixed(1)}%). We recommend a specialized ${ds.domain_name} test.`
        });
      }
    });

    // Save AssessmentAttempt
    let finalTypeId = assessment_type_id;
    if (!finalTypeId) {
      const generalType = await AssessmentType.findOne({ name: /General/i });
      if (generalType) {
        finalTypeId = generalType._id;
      } else {
        const firstType = await AssessmentType.findOne();
        finalTypeId = firstType ? firstType._id : undefined;
      }
    }

    if (!finalTypeId) {
      throw new Error('Could not determine assessment type ID');
    }

    const attempt = new AssessmentAttempt({
      student_id: studentId,
      assessment_type_id: finalTypeId,
      total_score: total_score,
      createdAt: new Date()
    });
    await attempt.save();

    // Save Answers
    const answerDocs = Object.entries(allAnswers)
      .filter(([qId, data]) => data && typeof data === 'object' && data.option_id)
      .map(([qId, data]) => ({
        attempt_id: attempt._id,
        question_id: qId,
        option_id: data.option_id,
        points_awarded: data.points || 0
      }));
    if (answerDocs.length > 0) {
      await Answer.insertMany(answerDocs);
    }

    // Save Score details
    const scoreDoc = new Score({
      attempt_id: attempt._id,
      total_score,
      maximum_total_score,
      overall_normalized_score,
      risk_level,
      domain_scores,
      recommendations
    });
    await scoreDoc.save();

    res.json({
      success: true,
      attempt_id: attempt._id,
      results: {
        total_score,
        maximum_total_score,
        overall_normalized_score,
        risk_level,
        domain_scores,
        recommendations
      }
    });
  } catch (err) {
    console.error('Error submitting assessment:', err.message);
    res.status(500).json({
      error: 'Failed to process assessment results',
      details: err.message
    });
  }
});

// @desc    Get average scores (RESTORED FRONTEND COMPATIBILITY)
router.get("/analytics/averages", async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find();
    res.json({});
  } catch (err) {
    res.status(500).json({ error: "Error fetching averages" });
  }
});

export default router;
