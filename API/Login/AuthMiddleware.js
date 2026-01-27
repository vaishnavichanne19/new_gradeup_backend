import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenModel } from "../../Model/TokenModel.js";
dotenv.config();

const AuthMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

     const validToken = await TokenModel.findOne({ token, isActive: true });
    if (!validToken) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default AuthMiddleware;
