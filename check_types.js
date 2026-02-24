
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AssessmentType from './backend/models/AssessmentType.js';

dotenv.config({ path: 'backend/.env' });

const checkTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const types = await AssessmentType.find();
        console.log('Assessment Types:', JSON.stringify(types, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkTypes();
