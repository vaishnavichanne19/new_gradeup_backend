import cron from "node-cron";
import { MeetingDataModule } from "../Model/MeetingModel.js";
import { handleReminder } from "../reminder/handlereminder.js";
import { getMeetingDateTime } from "../reminder/datehelper.js";

let isRunning = false;

cron.schedule("*/2 * * * *", async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = new Date();

    const meetings = await MeetingDataModule.find({
      status: "scheduled",
    });

    for (const m of meetings) {
      const meetingTime = getMeetingDateTime(m.date, m.time);
      const diff = Math.floor((meetingTime - now) / 60000);

      // ⏰ 1 Day Reminder (1440 → 1430 window)
      if (diff <= 1440 && diff > 1430 && !m.wa_1day) {
        await handleReminder(m, "1day");
        await m.save();
      }

      // ⏰ 1 Hour Reminder (60 → 55 window)
      if (diff <= 60 && diff > 55 && !m.wa_1hr) {
        await handleReminder(m, "1hr");
        await m.save();
      }

      // ⏰ 30 Min Reminder (30 → 25 window)
      if (diff <= 30 && diff > 25 && !m.wa_30min) {
        await handleReminder(m, "30min");
        await m.save();
      }
    }
  } catch (err) {
    console.error("Cron error:", err);
  } finally {
    isRunning = false;
  }
});
