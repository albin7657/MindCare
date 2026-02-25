
import mongoose from 'mongoose';
import Option from './backend/models/Option.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindcare');
        console.log('Connected to MongoDB');

        // 1. Find all options assigned to questions
        const options = await Option.find({ question_id: { $ne: null } });
        console.log(`Found ${options.length} options linked to questions.`);

        // 2. Identify duplicates
        const seen = new Map();
        const toDelete = [];

        options.forEach(opt => {
            const key = `${opt.question_id}_${opt.points}_${opt.option_text}`;
            if (seen.has(key)) {
                toDelete.push(opt._id);
            } else {
                seen.set(key, true);
            }
        });

        console.log(`Identified ${toDelete.length} duplicate options.`);

        if (toDelete.length > 0) {
            const result = await Option.deleteMany({ _id: { $in: toDelete } });
            console.log(`Successfully deleted ${result.deletedCount} duplicate options.`);
        } else {
            console.log('No duplicates found for cleaning.');
        }

        // 3. Optional: Double check template options (where question_id is null)
        // There shouldn't be duplicates there unless manually created twice.
        const templates = await Option.find({ question_id: null });
        const templateSeen = new Map();
        const templateToDelete = [];

        templates.forEach(opt => {
            const key = `${opt.option_set_id}_${opt.points}_${opt.option_text}`;
            if (templateSeen.has(key)) {
                templateToDelete.push(opt._id);
            } else {
                templateSeen.set(key, true);
            }
        });

        if (templateToDelete.length > 0) {
            console.log(`Found ${templateToDelete.length} duplicate template options. Cleaning up...`);
            await Option.deleteMany({ _id: { $in: templateToDelete } });
        }

    } catch (err) {
        console.error('Cleanup error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

cleanup();
