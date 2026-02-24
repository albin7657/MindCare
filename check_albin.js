import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./backend/models/User.js";
import Admin from "./backend/models/Admin.js";

dotenv.config({ path: 'backend/.env' });

const checkAlbin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const users = await User.find({ $or: [{ email: /albin/i }, { name: /albin/i }] });
        console.log("Users found:", JSON.stringify(users, null, 2));

        const admins = await Admin.find({ $or: [{ email: /albin/i }, { username: /albin/i }] });
        console.log("Admins (separate collection) found:", JSON.stringify(admins, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAlbin();
