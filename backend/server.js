import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import domainsRoutes from "./routes/domainsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import optionRoutes from "./routes/optionRoutes.js";
//import assessmentRoutes from "./routes/assessmentRoutes.js";

//import resultRoutes from "./routes/resultRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/domains", domainsRoutes);
//app.use("/api/assessment", assessmentRoutes);
app.use("/api/questions", questionRoutes);
//app.use("/api/results", resultRoutes);
app.use("/api/options", optionRoutes);



connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

