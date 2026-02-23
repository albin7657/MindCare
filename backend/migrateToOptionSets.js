import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import OptionSet from './models/OptionSet.js';
import Option from './models/Option.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    console.log('Starting migration to new Option Set structure...\n');

    // Create standard option sets
    const optionSets = await OptionSet.insertMany([
      {
        set_name: 'Likert Scale 5 (Never-Always)',
        description: 'Standard 5-point Likert scale from Never to Almost Always'
      },
      {
        set_name: 'Sleep Scale 4 (Past Month)',
        description: '4-point scale for sleep quality assessment'
      }
    ]);

    console.log('Created Option Sets:');
    optionSets.forEach(set => console.log(`  - ${set.set_name} (ID: ${set._id})`));

    // Create options for Likert Scale 5
    const likertOptions = [
      { option_set_id: optionSets[0]._id, option_text: 'Never', points: 0, order: 0 },
      { option_set_id: optionSets[0]._id, option_text: 'Rarely', points: 1, order: 1 },
      { option_set_id: optionSets[0]._id, option_text: 'Sometimes', points: 2, order: 2 },
      { option_set_id: optionSets[0]._id, option_text: 'Often', points: 3, order: 3 },
      { option_set_id: optionSets[0]._id, option_text: 'Almost Always', points: 4, order: 4 }
    ];

    // Create options for Sleep Scale
    const sleepOptions = [
      { option_set_id: optionSets[1]._id, option_text: 'Not during the past month', points: 0, order: 0 },
      { option_set_id: optionSets[1]._id, option_text: 'Less than once a week', points: 1, order: 1 },
      { option_set_id: optionSets[1]._id, option_text: 'Once or twice a week', points: 2, order: 2 },
      { option_set_id: optionSets[1]._id, option_text: 'Three or more times a week', points: 3, order: 3 }
    ];

    await Option.insertMany([...likertOptions, ...sleepOptions]);
    console.log('\nCreated Options:');
    console.log(`  - ${likertOptions.length} options for Likert Scale`);
    console.log(`  - ${sleepOptions.length} options for Sleep Scale`);

    // Update all questions to use the Likert Scale 5 option set
    const questions = await Question.find();
    console.log(`\nUpdating ${questions.length} questions to use Option Sets...`);

    await Question.updateMany(
      {},
      { option_set_id: optionSets[0]._id }
    );

    console.log('✓ All questions updated to use Likert Scale 5 option set');

    console.log('\n✓ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. If you have questions for Sleep Assessment, update them to use:');
    console.log(`   Option Set ID: ${optionSets[1]._id}`);
    console.log('2. You can now delete old options that are no longer referenced');
    
    process.exit();
  } catch (err) {
    console.error('Error during migration:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
