import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const student = new Student({ ...req.body, password: hash });
  await student.save();
  res.json({ message: "Registered Successfully" });
});

router.post("/login", async (req, res) => {
  const user = await Student.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Invalid password");

  res.json(user);
});

export default router;
