import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Create individual domains
    const domainData = [
      { domain_name: 'Stress', color: '#3498db' },
      { domain_name: 'Anxiety', color: '#33db8d' },
      { domain_name: 'Depression', color: '#db8433' },
      { domain_name: 'Burnout', color: '#33db55' },
      { domain_name: 'Sleep', color: '#a00376' }
    ];

    const newDomains = await Domain.insertMany(domainData);
    console.log('Created domains:', newDomains.map(d => ({ name: d.domain_name, id: d._id })));

    // Get all questions
    const questions = await Question.find();
    console.log(`\nTotal questions to reassign: ${questions.length}`);

    // Get the new domain IDs for mapping
    const stressDomain = newDomains.find(d => d.domain_name === 'Stress');
    const anxietyDomain = newDomains.find(d => d.domain_name === 'Anxiety');
    const depressionDomain = newDomains.find(d => d.domain_name === 'Depression');
    const burnoutDomain = newDomains.find(d => d.domain_name === 'Burnout');
    const sleepDomain = newDomains.find(d => d.domain_name === 'Sleep');

    // Based on question count from migration (24 Stress, 19 each for others)
    // Distribute questions
    const stressQuestions = questions.slice(0, 24);
    const anxietyQuestions = questions.slice(24, 43);
    const depressionQuestions = questions.slice(43, 62);
    const burnoutQuestions = questions.slice(62, 81);
    const sleepQuestions = questions.slice(81, 100);

    // Update domains for each group
    await Question.updateMany(
      { _id: { $in: stressQuestions.map(q => q._id) } },
      { domain_id: stressDomain._id }
    );
    await Question.updateMany(
      { _id: { $in: anxietyQuestions.map(q => q._id) } },
      { domain_id: anxietyDomain._id }
    );
    await Question.updateMany(
      { _id: { $in: depressionQuestions.map(q => q._id) } },
      { domain_id: depressionDomain._id }
    );
    await Question.updateMany(
      { _id: { $in: burnoutQuestions.map(q => q._id) } },
      { domain_id: burnoutDomain._id }
    );
    await Question.updateMany(
      { _id: { $in: sleepQuestions.map(q => q._id) } },
      { domain_id: sleepDomain._id }
    );

    console.log('\nQuestions reassigned:');
    console.log(`  - Stress: ${stressQuestions.length}`);
    console.log(`  - Anxiety: ${anxietyQuestions.length}`);
    console.log(`  - Depression: ${depressionQuestions.length}`);
    console.log(`  - Burnout: ${burnoutQuestions.length}`);
    console.log(`  - Sleep: ${sleepQuestions.length}`);

    console.log('\nRestore complete!');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
