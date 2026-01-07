import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { formatTimeAMPM } from "./timeUtils.js";
dotenv.config();

const ADMIN_EMAIL = "remindercny@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


export const sendMeetingCreatedEmail = async (email, meeting) => {
 await transporter.sendMail({
    from: `"Sales System" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "✅ Meeting Scheduled",
    html: `
      <h2>Meeting Scheduled</h2>
      <p>Your meeting has been successfully scheduled.</p>
      <hr/>
      <p><b>Tution Name:</b> ${meeting.tution_name}</p>
      <p><b>Date:</b> ${new Date(meeting.date).toDateString()}</p>
     <p><b>Time:</b> ${formatTimeAMPM(meeting.time)}</p>
      <p><b>Message:</b> ${meeting.msg}</p>
    `,
  });
};

// Reschedule email
export const sendRescheduleEmail = async (email, meeting) => {
  await transporter.sendMail({
    from: `"Sales System" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🔄 Meeting Rescheduled",
    html: `
      <h2>Meeting Rescheduled</h2>
      <p>Tution Name: ${meeting.tution_name}</p>
      <p>Old Date: ${new Date(meeting.reschedule.oldDate).toDateString()}</p>
      <p>Old Time: ${formatTimeAMPM(meeting.reschedule.oldTime)}</p>
      <p>New Date: ${new Date(meeting.reschedule.newDate).toDateString()}</p>
      <p>New Time: ${formatTimeAMPM(meeting.reschedule.newTime)}</p>
      <p>Reason: ${meeting.reschedule.reason}</p>
    `,
  });
};

// Follow-up email
export const sendFollowUpEmail = async (email, meeting) => {
  await transporter.sendMail({
    from: `"Sales System" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "📌 Follow-Up Scheduled",
    html: `
      <h2>Follow-Up Added</h2>
      <p>Tution Name: ${meeting.tution_name}</p>
      <p>Next Meeting Date: ${meeting.followUp.nextMeetingDate ? new Date(meeting.followUp.nextMeetingDate).toDateString() : 'N/A'}</p>
      <p>Next Meeting Time: ${formatTimeAMPM(meeting.followUp.nextMeetingTime) || 'N/A'}</p>
      <p>Purpose: ${meeting.followUp.purpose}</p>
      <p>Visit Note: ${meeting.followUp.visitNote}</p>
      <p>Next Follow-Up Date: ${meeting.followUp.nextFollowUp?.date ? new Date(meeting.followUp.nextFollowUp.date).toDateString() : 'N/A'}</p>
      <p>Next Follow-Up Time: ${formatTimeAMPM(meeting.followUp.nextFollowUp?.time) || 'N/A'}</p>
      <p>Next Follow-Up Note: ${meeting.followUp.nextFollowUp?.note || 'N/A'}</p>
    `,
  });
};



export const sendReminderEmail = async (email, meeting, type, dateTime, message) => {
  await transporter.sendMail({
    from: `"Sales System Reminder" <${process.env.GMAIL_USER}>`,
    to: [email, ADMIN_EMAIL].join(","),
    subject: `⏰ ${type} | ${meeting.tution_name}`,
    html: `
      <h3>${type}</h3>
      <p><b>Tution:</b> ${meeting.tution_name}</p>
      <p><b>Date:</b> ${dateTime.toDateString()}</p>
      <p><b>Time:</b> ${dateTime.toLocaleTimeString()}</p>
      <p><b>Note:</b> ${message}</p>
    `,
  });
};