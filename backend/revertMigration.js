import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Domain from './models/Domain.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Get the individual domain IDs
    const stressDomain = await Domain.findOne({ domain_name: 'Stress' });
    const anxietyDomain = await Domain.findOne({ domain_name: 'Anxiety' });
    const burnoutDomain = await Domain.findOne({ domain_name: 'Burnout' });
    const depressionDomain = await Domain.findOne({ domain_name: 'Depression' });
    const sleepDomain = await Domain.findOne({ domain_name: 'Sleep' });

    // Get the combined domain IDs
    const stressAnxietyDomain = await Domain.findOne({ domain_name: 'Stress and Anxiety' });
    const depressionBurnoutDomain = await Domain.findOne({ domain_name: 'Depression and Burnout' });
    const sleepAssessmentDomain = await Domain.findOne({ domain_name: 'Sleep Assessment' });

    // Migrate back Stress and Anxiety questions
    if (stressAnxietyDomain && stressDomain && anxietyDomain) {
      const stressResult = await Question.updateMany(
        { domain_id: stressAnxietyDomain._id },
        [
          {
            $cond: [
              { $regex: ['$question_text', '^In the last month|^You feel|^You have|^I experienced|^I felt I|^In the last three'] },
              { $set: { domain_id: stressDomain._id } },
              { $set: { domain_id: anxietyDomain._id } }
            ]
          }
        ]
      );
      console.log('Migrated Stress and Anxiety back');
    }

    // For now, manually reassign to original domains
    const allStressAnxietyQuestions = await Question.find({ domain_id: stressAnxietyDomain?._id });
    if (allStressAnxietyQuestions && allStressAnxietyQuestions.length > 0) {
      // Split approximately - first half to Stress, second to Anxiety
      const mid = Math.ceil(allStressAnxietyQuestions.length / 2);
      
      const stressIds = allStressAnxietyQuestions.slice(0, mid).map(q => q._id);
      const anxietyIds = allStressAnxietyQuestions.slice(mid).map(q => q._id);
      
      if (stressDomain && stressIds.length > 0) {
        await Question.updateMany({ _id: { $in: stressIds } }, { domain_id: stressDomain._id });
      }
      if (anxietyDomain && anxietyIds.length > 0) {
        await Question.updateMany({ _id: { $in: anxietyIds } }, { domain_id: anxietyDomain._id });
      }
    }

    // Migrate back Depression and Burnout
    const allDepBurnQuestions = await Question.find({ domain_id: depressionBurnoutDomain?._id });
    if (allDepBurnQuestions && allDepBurnQuestions.length > 0) {
      const mid = Math.ceil(allDepBurnQuestions.length / 2);
      
      const depIds = allDepBurnQuestions.slice(0, mid).map(q => q._id);
      const burnIds = allDepBurnQuestions.slice(mid).map(q => q._id);
      
      if (depressionDomain && depIds.length > 0) {
        await Question.updateMany({ _id: { $in: depIds } }, { domain_id: depressionDomain._id });
      }
      if (burnoutDomain && burnIds.length > 0) {
        await Question.updateMany({ _id: { $in: burnIds } }, { domain_id: burnoutDomain._id });
      }
    }

    // Migrate back Sleep
    const allSleepQuestions = await Question.find({ domain_id: sleepAssessmentDomain?._id });
    if (allSleepQuestions && sleepDomain && allSleepQuestions.length > 0) {
      await Question.updateMany({ _id: { $in: allSleepQuestions.map(q => q._id) } }, { domain_id: sleepDomain._id });
    }

    // Delete combined domains
    if (stressAnxietyDomain) await Domain.deleteOne({ _id: stressAnxietyDomain._id });
    if (depressionBurnoutDomain) await Domain.deleteOne({ _id: depressionBurnoutDomain._id });
    if (sleepAssessmentDomain) await Domain.deleteOne({ _id: sleepAssessmentDomain._id });

    console.log('Migration reverted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
