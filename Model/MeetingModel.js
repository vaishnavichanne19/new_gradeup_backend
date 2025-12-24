import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    tution_name: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    owner_no: {
      type: String,
    },
    domain: {
      type: String,
    },
    marketingType: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    reschedule: {
      isRescheduled: { type: Boolean, default: false },
      oldDate: Date,
      oldTime: String,
      newDate: Date,
      newTime: String,
      reason: String,
    },

    followUp: {
      purpose: String,
      visitNote: String,
      nextMeetingDate: Date,
      nextMeetingTime: String,
      nextFollowUp: {
        date: Date,
        time: String,
        note: String,
      },
    },

    push_1day: { type: Boolean, default: false },
    push_1hr: { type: Boolean, default: false },
    push_30min: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const pushSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

export const PushModel = mongoose.model("PushSub", pushSchema);
export const MeetingDataModule = mongoose.model("Meeting", meetingSchema);

