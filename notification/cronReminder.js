import cron from "node-cron";
import { MeetingDataModule } from "../Model/MeetingModel.js";
import { handleReminder } from "../reminder/handlereminder.js";
import { getMeetingDateTime } from "../reminder/datehelper.js";

cron.schedule("*/2 * * * *", async () => {
  const now = new Date();

  const meetings = await MeetingDataModule.find({ status: "scheduled" });

  for (const m of meetings) {
    const meetingTime = getMeetingDateTime(m.date, m.time);
    const diff = Math.floor((meetingTime - now) / 60000);

    if (diff <= 1440 && diff > 1380 && !m.push_1day) {
      await handleReminder(m, "1day");
      await m.save();
    }

    if (diff <= 60 && diff > 50 && !m.push_1hr) {
      await handleReminder(m, "1hr");
      await m.save();
    }

    if (diff <= 30 && diff > 20 && !m.push_30min) {
      await handleReminder(m, "30min");
      await m.save();
    }
  }
});
