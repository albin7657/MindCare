import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const domains = await Domain.find();
    console.log('All domains:', domains.map(d => ({ name: d.domain_name, id: d._id })));
    
    const questions = await Question.find().limit(3);
    console.log('\nSample questions:');
    questions.forEach(q => {
      console.log(`  - "${q.question_text.substring(0, 50)}..." (domain_id: ${q.domain_id})`);
    });

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
