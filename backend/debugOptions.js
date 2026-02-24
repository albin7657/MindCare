import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Option from './models/Option.js';
import OptionSet from './models/OptionSet.js';

dotenv.config();
if (!process.env.MONGO_URI) {
    dotenv.config({ path: 'backend/.env' });
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const questions = await Question.find();
    console.log('Found', questions.length, 'questions');

    for (const q of questions) {
        console.log(`Q: ${q.question_text}, Set: ${q.option_set_id}`);
        const opts = await Option.find({ option_set_id: q.option_set_id });
        console.log(`- Found ${opts.length} options for this set`);
    }

    const sets = await OptionSet.find();
    console.log('Total sets:', sets.length);
    for (const s of sets) {
        const o = await Option.find({ option_set_id: s._id });
        console.log(`Set ${s.set_name} has ${o.length} options`);
    }

    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
