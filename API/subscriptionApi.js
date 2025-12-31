import { saveSubscription } from "../notification/push.js";

export const Subscription = async (req, res) => {
 await saveSubscription(req.body);
  res.status(201).json({ message: "Subscription saved" });
};

