import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./backend/models/User.js";
import Admin from "./backend/models/Admin.js";

dotenv.config({ path: 'backend/.env' });

const verifyAlbin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const loginInput = "albin";
        const passwordInput = "albinpassword"; // Assuming this is the password based on user's message or context

        // Simulating the logic in authRoutes.js
        let user = await User.findOne({ email: loginInput });
        let role = user ? user.role : null;

        if (!user) {
            user = await Admin.findOne({
                $or: [{ email: loginInput }, { username: loginInput }]
            });
            if (user) {
                role = "admin";
            }
        }

        if (user) {
            console.log("User found in collection:", user.constructor.modelName);
            console.log("Username/Email:", user.username || user.email);

            // We know the hash for albin from admins_dump.json: $2b$10$MwK0hDGJxdXJM4RihnUQdu0Jn.hUG9txbctVrd2IOd/rVsY3QTdn.
            // Let's test if we can match it.
            // Wait, I don't know the plain text password for albin.
            // The user said "credientails that is albin is not working".
            // Let's just verify the comparePassword method exists and runs.
            const isMatch = await user.comparePassword("wrong_password");
            console.log("comparePassword method exists and returned:", isMatch);
        } else {
            console.log("User 'albin' not found even after fix.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyAlbin();
