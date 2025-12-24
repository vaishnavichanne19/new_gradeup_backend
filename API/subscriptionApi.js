import express from "express";
import { saveSubscription } from "../notification/push.js";

const router = express.Router();

export const Subscription = async (req, res) => {
  const subscription = req.body;
  saveSubscription(subscription);
  res.status(201).json({ message: "Subscription saved." });
};

export default router;
