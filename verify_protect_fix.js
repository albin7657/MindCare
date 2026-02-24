
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './backend/models/Admin.js';
import User from './backend/models/User.js';
import { protect } from './backend/middleware/authMiddleware.js';

dotenv.config({ path: 'backend/.env' });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find Albin in Admins
        const albin = await Admin.findOne({ username: 'albin' });
        if (!albin) {
            console.error('Albin not found in Admins');
            process.exit(1);
        }

        console.log('Found Albin:', albin._id, albin.username);

        // Generate token
        const token = jwt.sign({ id: albin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Mock req, res, next
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        const res = {
            status: function (code) {
                console.log('Response Status:', code);
                return this;
            },
            json: function (data) {
                console.log('Response JSON:', data);
                return this;
            }
        };
        const next = () => {
            console.log('Middleware passed! req.user:', req.user.username, 'role:', req.user.role);
            if (req.user.role === 'admin') {
                console.log('Role correctly assigned as admin');
            } else {
                console.error('Role NOT assigned as admin');
            }
        };

        await protect(req, res, next);

        mongoose.connection.close();
    } catch (err) {
        console.error('Verification failed', err);
        process.exit(1);
    }
};

verify();
