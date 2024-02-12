import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/User.js";
import authrouter from "./Routes/auth.js";

dotenv.config();
//Database
mongoose
  .connect(process.env.mongoDBURL, {})
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(err));

app.use(express.json());
//ROUTER
app.use("/api/v1", router);
app.use("/api/v1/auth", authrouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Backend server is running on ${process.env.PORT}!`);
});
