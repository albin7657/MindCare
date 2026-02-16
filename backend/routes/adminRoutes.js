import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {

    // 🔥 LOGIN USING USERNAME
    const admin = await Admin.findOne({
      username: req.body.username
    });

    if (!admin) {
      return res.status(400).json("Admin not found");
    }

    const valid = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!valid) {
      return res.status(400).json("Invalid password");
    }

    res.json({
      admin_id: admin.admin_id,
      username: admin.username,
      email: admin.email
    });

  } catch (err) {
    res.status(500).json("Server error");
  }
});

export default router;
