
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './backend/models/Question.js';
import Domain from './backend/models/Domain.js';
import AssessmentType from './backend/models/AssessmentType.js';

dotenv.config({ path: 'backend/.env' });

const checkQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const questions = await Question.find().populate('domain_id');
        const problematic = questions.filter(q => !q.domain_id);

        if (problematic.length > 0) {
            console.log('Problematic Questions (No Domain):', problematic.length);
            problematic.forEach(q => console.log(`Question: ${q.question_text}, ID: ${q._id}`));
        } else {
            console.log('All questions have valid domains.');
        }

        const questionsWithoutOptions = questions.filter(q => !q.option_set_id);
        console.log('Questions without OptionSet:', questionsWithoutOptions.length);

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkQuestions();
