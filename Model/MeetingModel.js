// import mongoose from "mongoose";

// const meetingSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "login",
//       required: true,
//     },

//     userEmail: {
//       type: String,
//       required: true,
//     },

//     leadId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LeadData",
//       required: true,
//     },
//     tution_name: {
//       type: String,
//       required: true,
//     },
//     owner_name: {
//       type: String,
//       required: true,
//     },
//     owner_no: {
//       type: String,
//     },
//     domain: {
//       type: String,
//     },
//     marketingType: {
//       type: String,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     time: {
//       type: String,
//       required: true,
//     },
//     meetingDateTime: {
//       type: Date,
//       required: true,
//       index: true,
//     },
//     msg: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["scheduled", "rescheduled", "completed"],
//       default: "scheduled",
//     },
//      emailReminder1DaySent: { type: Boolean, default: false },
//     emailReminder1HourSent: { type: Boolean, default: false },

//     reschedule: {
//       isRescheduled: { type: Boolean, default: false },
//       oldDate: Date,
//       oldTime: String,
//       newDate: Date,
//       newTime: String,
//       reason: String,
//       rescheduleemail1DaySent: { type: Boolean, default: false },
//       rescheduleemail1HourSent: { type: Boolean, default: false },
//     },
    
//     rescheduleDateTime: Date,

//     followUp: {
//       purpose: String,
//       visitNote: String,
//       nextMeetingDate: Date,
//       nextMeetingTime: String,
//       nextFollowUp: {
//         date: Date,
//         time: String,
//         note: String,
//       },
//       followupemail1DaySent: { type: Boolean, default: false },
//       followupemail1HourSent: { type: Boolean, default: false },
//     },
    
//     followUpDateTime: Date,
//   },
//   {
//     timestamps: { createdAt: "created_at", updatedAt: false },
//   }
// );

// export const MeetingDataModule = mongoose.model("Meeting", meetingSchema);









import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeadData",
      required: true,
    },
    tution_name: {
      type: String,
    },
    owner_name: {
      type: String,
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
    },
    time: {
      type: String,
    },
    meetingDateTime: {
      type: Date,
      index: true,
    },
    msg: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "completed"],
      default: "scheduled",
    },
    completemsg: {
      type: String,
    },
     emailReminder1DaySent: { type: Boolean, default: false },
    emailReminder1HourSent: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export const MeetingDataModule = mongoose.model("Meeting", meetingSchema);
