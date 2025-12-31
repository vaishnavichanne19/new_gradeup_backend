import mongoose from "mongoose";

const authSchema = mongoose.Schema({
  username: { type: String },
   mobileno: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
  password: { type: String, required: true },
},
{ timestamps: true }
);

export const LoginModule = mongoose.model("login", authSchema);
