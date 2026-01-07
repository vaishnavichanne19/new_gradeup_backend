import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginModule } from "../../Model/LoginModel.js";


// REGISTER
export const Registration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await LoginModule.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    await LoginModule.create({ username, email, password: hashed });

    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// LOGIN
export const Login = async (req, res) => {
   try {
  const { email, password } = req.body;
  const user = await LoginModule.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email Not Found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Incorrect Password" });

  const token = jwt.sign({ userId: user._id, email: user.email, }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 86400000,
    secure: true,
  });

  res.json({
    success: true,
    message: "Logged in",
    token,
    user: { id: user._id, email: user.email },
  });
   } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await LoginModule.findById(req.user.userId).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
