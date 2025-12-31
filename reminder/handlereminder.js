import { sendPush } from "../notification/push.js";


export const handleReminder = async (meeting, type) => {
  if (!meeting[`push_${type}`]) {
    await sendPush(
      "Meeting Reminder",
      `Meeting with ${meeting.tution_name} in ${
        type === "1day" ? "1 day" :
        type === "1hr" ? "1 hour" : "30 minutes"
      }`
    );

    meeting[`push_${type}`] = true;
  }
};
