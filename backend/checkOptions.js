import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';
import Option from './models/Option.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Check Stress and Anxiety domain
    const domain = await Domain.findOne({ domain_name: 'Stress and Anxiety' });
    const questions = await Question.find({ domain_id: domain._id });
    console.log(`Found ${questions.length} questions in Stress and Anxiety domain`);
    
    if (questions.length > 0) {
      const firstQuestion = questions[0];
      console.log('\nFirst question:', firstQuestion.question_text);
      
      const options = await Option.find({ question_id: firstQuestion._id });
      console.log(`Has ${options.length} options`);
      if (options.length > 0) {
        console.log('Sample options:', options.slice(0, 2).map(o => ({ text: o.option_text, points: o.points })));
      }
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
