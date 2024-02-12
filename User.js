import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/User";
import { verifyTokenAndAuthorization } from "./verifyToken";

const router = express.Router();

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => { 
      
    const {password } = req.body;
  if (password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ... (other routes)

module.exports = router;
