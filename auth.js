import express from "express";
import bcrypt from "bcryptjs"; // Import bcryptjs
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router(); 
const salt = bcrypt.genSaltSync(10);

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
     
  try {
    const userDoc = await User.create({
        username, 
        password: bcrypt.hashSync(password, salt),
       });

      res.json(userDoc);
   }
   catch(error) {
        res.status(400).json(error);
   }
  // // Hash the password
  // const hashedPassword = await bcrypt.hash(password, 10); // Hash with a salt round of 10

  // const newUser = new User({
  //   username,
  //   email,
  //   password: hashedPassword, // Store the hashed password
  // });

  // try {
  //   const savedUser = await newUser.save();
  //   const { password, ...otherdata } = User.doc;
  //   res.status(201).json(savedUser);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json(err);
  // }
});

// LOGIN (Assuming it's a POST request)
router.get("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Wrong credentials!" });
    }
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong credentials!" });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    res.status(200).json({ message: "Login successful!", accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
