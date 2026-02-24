
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './backend/models/Question.js';
import Domain from './backend/models/Domain.js';
import Option from './backend/models/Option.js';
import AssessmentAttempt from './backend/models/AssessmentAttempt.js';
import Answer from './backend/models/Answer.js';
import Score from './backend/models/Score.js';
import User from './backend/models/User.js';

dotenv.config({ path: 'backend/.env' });

const testScoring = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Fetch a user
        const user = await User.findOne({ role: 'student' });
        if (!user) {
            console.error('No student user found');
            process.exit(1);
        }

        // Fetch some questions
        const questions = await Question.find().limit(5).populate('domain_id');
        if (questions.length === 0) {
            console.error('No questions found');
            process.exit(1);
        }

        console.log('Testing with', questions.length, 'questions');

        // Mock answers payload
        const answers = {
            screen1: {},
            screen2: {},
            screen3: {}
        };

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const options = await Option.find({
                $or: [{ option_set_id: q.option_set_id }, { question_id: q._id }]
            });
            if (options.length > 0) {
                // Pick the second option (usually points > 0)
                const opt = options[1] || options[0];
                answers.screen1[q._id] = {
                    points: opt.points,
                    option_id: opt._id
                };
            }
        }

        // Simulate POST /api/assessment-attempts
        // We'll just run the logic manually here to verify calculations
        const allAnswers = { ...answers.screen1, ...answers.screen2, ...answers.screen3 };
        const qIds = Object.keys(allAnswers);
        const dbQuestions = await Question.find({ _id: { $in: qIds } }).populate("domain_id");

        const domainData = {};
        for (const q of dbQuestions) {
            const domainId = q.domain_id._id.toString();
            if (!domainData[domainId]) {
                domainData[domainId] = {
                    domain_name: q.domain_id.domain_name,
                    total_points: 0,
                    max_points: 0
                };
            }
            const ans = allAnswers[q._id.toString()];
            domainData[domainId].total_points += ans.points;

            const options = await Option.find({
                $or: [{ option_set_id: q.option_set_id }, { question_id: q._id }]
            });
            domainData[domainId].max_points += Math.max(...options.map(o => o.points), 0);
        }

        console.log('Calculation Verification:');
        Object.entries(domainData).forEach(([id, data]) => {
            const norm = (data.total_points / data.max_points) * 100;
            console.log(`Domain ${data.domain_name}: Score ${data.total_points}/${data.max_points} (${norm.toFixed(1)}%)`);
        });

        console.log('Database Schema Verification:');
        const scoreFields = Object.keys(Score.schema.paths);
        const requiredFields = ['total_score', 'maximum_total_score', 'overall_normalized_score', 'risk_level', 'domain_scores'];
        const missing = requiredFields.filter(f => !scoreFields.includes(f));
        if (missing.length === 0) {
            console.log('Score schema updated correctly');
        } else {
            console.error('Missing fields in Score schema:', missing);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Test failed', err);
        process.exit(1);
    }
};

testScoring();
