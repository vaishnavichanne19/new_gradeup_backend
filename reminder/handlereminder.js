import { sendPush } from "../notification/push.js";

export const handleReminder = async (m, type) => {
  if (!m[`push_${type}`]) {
    await sendPush(
      "Meeting Reminder",
      `Meeting with ${m.tution_name} in ${
        type === "1day"
          ? "1 day"
          : type === "1hr"
          ? "1 hour"
          : "30 minutes"
      }`
    );

    m[`push_${type}`] = true;
  }
};
