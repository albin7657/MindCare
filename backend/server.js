import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

/*import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);*/

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

