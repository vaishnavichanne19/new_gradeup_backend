// Model/TokenModel.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Login",
  },
  token: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const TokenModel = mongoose.model("Token", TokenSchema);
