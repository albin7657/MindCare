import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const questions = await Question.find().populate('domain_id');
  console.log('Total questions:', questions.length);
  const byDomain = {};
  questions.forEach(q => {
    const domain = q.domain_id?.domain_name || 'Unknown';
    byDomain[domain] = (byDomain[domain] || 0) + 1;
  });
  console.log('Questions by domain:', byDomain);
  process.exit();
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
