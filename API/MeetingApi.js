import { MeetingDataModule } from "../Model/MeetingModel.js";
import {
  sendFollowUpEmail,
  sendMeetingCreatedEmail,
  sendRescheduleEmail,
} from "../notification/emailSender.js";

export const CreateMeeting = async (req, res) => {
  try {
    const {
      leadId,
      tution_name,
      owner_name,
      owner_no,
      domain,
      marketingType,
      date,
      time,
      msg,
    } = req.body;

    if (!leadId || !date || !time) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const meetingDateTime = new Date(`${date}T${time}:00`);

    const meeting = await MeetingDataModule.create({
      leadId,
      tution_name,
      owner_name,
      owner_no,
      domain,
      marketingType,
      date,
      time,
      meetingDateTime,
      msg,
      userId: req.user.userId,
      userEmail: req.user.email,
    });

    await sendMeetingCreatedEmail(req.user.email, meeting);

    res.status(201).json({
      success: true,
      message: "Meeting created & email sent",
      data: meeting,
    });
  } catch (error) {
    console.error("CreateMeeting Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllUserMeeting = async (req, res) => {
  try {
    const Meeting = await MeetingDataModule.find().populate(
      "userId",
      "username email"
    ).populate("leadId", "area");

    if (!Meeting) {
      return res.status(404).json({ msg: "Data Not Found" });
    }
    res.status(200).json({ success: true, data: Meeting });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Meetings" });
  }
};

export const GetMeeting = async (req, res) => {
  try {
    const Meeting = await MeetingDataModule.find({
      userId: req.user.userId,
    })
      .populate("leadId", "companyname area location")
      .sort({ created_at: -1 });
    if (!Meeting) {
      return res.status(404).json({ msg: "Data Not Found" });
    }
    res.status(200).json({ success: true, data: Meeting });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Meetings" });
  }
};

export const GetMeetingId = async (req, res) => {
  const {id} = req.params;

  try {
    const MeetingId = await MeetingDataModule.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!MeetingId) {
      return res.status(404).json({ msg: "user data not found" });
    }
    res.status(200).json({success: true, message:"Get All Data", data: MeetingId });
  } catch (error) {
    console.error("Error fetching Meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


export const GetAllMeetingId = async (req, res) => {
  const {id} = req.params;

  try {
    const MeetingId = await MeetingDataModule.findOne({
      _id: id
    }).populate(
      "userId",
      "username email"
    ).populate("leadId", "area");

    if (!MeetingId) {
      return res.status(404).json({ msg: "user data not found" });
    }
    res.status(200).json({success: true, message:"Get All Data", data: MeetingId });
  } catch (error) {
    console.error("Error fetching Meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


// export const updateMeeting = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const meetingdata = await MeetingDataModule.findById(id);
//     if (!meetingdata) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "User Data not found" });
//     }

//     const Updatemeetingdata = await MeetingDataModule.findByIdAndUpdate(
//       { _id: req.params.id, userId: req.user.userId },
//       req.body,
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       data: Updatemeetingdata,
//       msg: "User updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating Meeting:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };


export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meetingdata = await MeetingDataModule.findById(id);
    if (!meetingdata) {
      return res
        .status(404)
        .json({ success: false, msg: "User Data not found" });
    }

    const Updatemeetingdata = await MeetingDataModule.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
       {
        ...req.body,
        status: "rescheduled",
      },
      { new: true }
    ).populate("leadId", "area");
    res.status(200).json({
      success: true,
      data: Updatemeetingdata,
      msg: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating Meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const DeleteMeeting = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedMeeting = await MeetingDataModule.findById(id);

    if (!deletedMeeting) {
      return res.status(404).json({ msg: "User data not found" });
    }
    await MeetingDataModule.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    res.status(200).json({ msg: "user deleted data successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Meeting" });
  }
};

export const RescheduleMeeting = async (req, res) => {
  const { newDate, newTime, reason } = req.body;

  const meeting = await MeetingDataModule.findById(req.params.id);
  if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

  const resDT = new Date(`${newDate}T${newTime}:00`);

  meeting.reschedule = {
    isRescheduled: true,
    oldDate: meeting.date,
    oldTime: meeting.time,
    newDate,
    newTime,
    reason,
    rescheduleemail1DaySent: false,
    rescheduleemail1HourSent: false,
  };

  meeting.date = newDate;
  meeting.time = newTime;
  meeting.meetingDateTime = resDT;
  meeting.rescheduleDateTime = resDT;
  meeting.emailReminder1DaySent = false;
  meeting.emailReminder1HourSent = false;
  meeting.status = "rescheduled";


  await meeting.save();
  await sendRescheduleEmail(meeting.userEmail, meeting);

  res.json({ success: true });
};


export const AddFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      purpose,
      visitNote,
      nextMeetingDate,
      nextMeetingTime,
      nextFollowUpDate,
      nextFollowUpTime,
      nextFollowUpNote,
    } = req.body;

    const meeting = await MeetingDataModule.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

      const followUpDT = new Date(
    `${nextFollowUpDate}T${nextFollowUpTime}:00`
  );

    meeting.followUp = {
      purpose,
      visitNote,
      nextMeetingDate,
      nextMeetingTime,
      nextFollowUp: {
        date: nextFollowUpDate || null,
        time: nextFollowUpTime || null,
        note: nextFollowUpNote || null,
      },
      followupemail1DaySent: false,
    followupemail1HourSent: false,
    };

     meeting.followUpDateTime = followUpDT;
    meeting.status = "completed";

    await meeting.save();

    await sendFollowUpEmail(meeting.userEmail, meeting);

    res.json({
      success: true,
      message: "Follow-up added successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const ConfirmMeeting = async (req, res) => {
 try {
    const { id } = req.params;
    const {
     completemsg
    } = req.body;

    const meeting = await MeetingDataModule.findById(id).populate("leadId", "area");
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    meeting.completemsg = completemsg;
    meeting.status = "completed";

    await meeting.save();
    res.json({
      success: true,
      message: "Meeting Completed successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
