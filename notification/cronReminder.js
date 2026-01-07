import cron from "node-cron";
import { MeetingDataModule } from "../Model/MeetingModel.js";
import { sendReminderEmail } from "./emailSender.js";


const shouldSend = (dt, mins) => {
  const diff = Math.floor((dt - new Date()) / 60000);
  return diff <= mins && diff > mins - 1;
};

cron.schedule("* * * * *", async () => {
  const meetings = await MeetingDataModule.find({
    status: { $in: ["scheduled", "rescheduled", "completed"] },
  });

  for (const m of meetings) {

    /* NORMAL */
    if (m.meetingDateTime) {
      if (shouldSend(m.meetingDateTime, 1440) && !m.emailReminder1DaySent) {
        await sendReminderEmail(m.userEmail, m, "Meeting - 1 Day Before", m.meetingDateTime, m.msg);
        m.emailReminder1DaySent = true;
      }

      if (shouldSend(m.meetingDateTime, 60) && !m.emailReminder1HourSent) {
        await sendReminderEmail(m.userEmail, m, "Meeting - 1 Hour Before", m.meetingDateTime, m.msg);
        m.emailReminder1HourSent = true;
      }
    }

    /* RESCHEDULE */
    if (m.rescheduleDateTime && m.status === "rescheduled") {
      if (shouldSend(m.rescheduleDateTime, 1440) && !m.reschedule.rescheduleemail1DaySent) {
        await sendReminderEmail(m.userEmail, m, "Rescheduled - 1 Day Before", m.rescheduleDateTime, m.reschedule.reason);
        m.reschedule.rescheduleemail1DaySent = true;
      }

      if (shouldSend(m.rescheduleDateTime, 60) && !m.reschedule.rescheduleemail1HourSent) {
        await sendReminderEmail(m.userEmail, m, "Rescheduled - 1 Hour Before", m.rescheduleDateTime, m.reschedule.reason);
        m.reschedule.rescheduleemail1HourSent = true;
      }
    }

    /* FOLLOW-UP */
    if (m.followUpDateTime && m.status === "completed") {
      if (shouldSend(m.followUpDateTime, 1440) && !m.followUp.followupemail1DaySent) {
        await sendReminderEmail(m.userEmail, m, "Follow-Up - 1 Day Before", m.followUpDateTime, m.followUp.nextFollowUp.note);
        m.followUp.followupemail1DaySent = true;
      }

      if (shouldSend(m.followUpDateTime, 60) && !m.followUp.followupemail1HourSent) {
        await sendReminderEmail(m.userEmail, m, "Follow-Up - 1 Hour Before", m.followUpDateTime, m.followUp.nextFollowUp.note);
        m.followUp.followupemail1HourSent = true;
      }
    }

    await m.save();
  }
});


