import webpush from "web-push";
import dotenv from "dotenv";
import { PushModel } from "../Model/MeetingModel.js";

dotenv.config();

webpush.setVapidDetails(
  "mailto:channevaishnavi8@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const saveSubscription = async (sub) => {
  const exists = await PushModel.findOne({ endpoint: sub.endpoint });
  if (!exists) {
    await PushModel.create(sub);
  }
};


export const sendPush = async (title, message) => {
  const payload = JSON.stringify({ title, body: message });

  const subs = await PushModel.find();

  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push error:", err.message);
    }
  }
};

