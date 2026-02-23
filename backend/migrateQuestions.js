import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Get the new domain IDs
    const stressAnxietyDomain = await Domain.findOne({ domain_name: 'Stress and Anxiety' });
    const depressionBurnoutDomain = await Domain.findOne({ domain_name: 'Depression and Burnout' });
    const sleepDomain = await Domain.findOne({ domain_name: 'Sleep Assessment' });

    if (!stressAnxietyDomain || !depressionBurnoutDomain || !sleepDomain) {
      console.error('New domains not found!');
      process.exit(1);
    }

    // Get old domain IDs
    const stressDomain = await Domain.findOne({ domain_name: 'Stress' });
    const anxietyDomain = await Domain.findOne({ domain_name: 'Anxiety' });
    const burnoutDomain = await Domain.findOne({ domain_name: 'Burnout' });
    const depressionDomain = await Domain.findOne({ domain_name: 'Depression' });
    const sleepOldDomain = await Domain.findOne({ domain_name: 'Sleep' });

    // Migrate Stress and Anxiety questions
    if (stressDomain) {
      const stressQuestions = await Question.updateMany(
        { domain_id: stressDomain._id },
        { domain_id: stressAnxietyDomain._id }
      );
      console.log('Migrated Stress questions:', stressQuestions.modifiedCount);
    }

    if (anxietyDomain) {
      const anxietyQuestions = await Question.updateMany(
        { domain_id: anxietyDomain._id },
        { domain_id: stressAnxietyDomain._id }
      );
      console.log('Migrated Anxiety questions:', anxietyQuestions.modifiedCount);
    }

    // Migrate Depression and Burnout questions
    if (depressionDomain) {
      const depressionQuestions = await Question.updateMany(
        { domain_id: depressionDomain._id },
        { domain_id: depressionBurnoutDomain._id }
      );
      console.log('Migrated Depression questions:', depressionQuestions.modifiedCount);
    }

    if (burnoutDomain) {
      const burnoutQuestions = await Question.updateMany(
        { domain_id: burnoutDomain._id },
        { domain_id: depressionBurnoutDomain._id }
      );
      console.log('Migrated Burnout questions:', burnoutQuestions.modifiedCount);
    }

    // Migrate Sleep questions
    if (sleepOldDomain) {
      const sleepQuestions = await Question.updateMany(
        { domain_id: sleepOldDomain._id },
        { domain_id: sleepDomain._id }
      );
      console.log('Migrated Sleep questions:', sleepQuestions.modifiedCount);
    }

    // Delete old domains
    const deletedDomains = await Domain.deleteMany({
      domain_name: { $in: ['Stress', 'Anxiety', 'Burnout', 'Depression', 'Sleep'] }
    });
    console.log('Deleted old domains:', deletedDomains.deletedCount);

    console.log('\nMigration complete!');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
