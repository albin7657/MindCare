import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
if (!process.env.MONGO_URI) {
    dotenv.config({ path: 'backend/.env' });
}

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "student@mindcare.com";
        const password = "studentpassword";

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found: " + email);
            process.exit(1);
        }

        console.log("User found:", user.email);
        console.log("Stored hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Manual bcrypt compare result:", isMatch);

        const isMatchMethod = await user.comparePassword(password);
        console.log("User model method compare result:", isMatchMethod);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin();
