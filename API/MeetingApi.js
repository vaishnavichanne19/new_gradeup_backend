import { MeetingDataModule } from "../Model/MeetingModel.js";
import { sendPush } from "../notification/push.js";

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
      msg
    } = req.body;

     if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    const meeting = await MeetingDataModule.create({
      leadId,
      tution_name,
      owner_name,
      owner_no,
      domain,
      marketingType,
      date,
      time,
      msg,
     userId: req.userId,
    });

    await sendPush(
      "New Meeting Scheduled",
      `Meeting with ${tution_name} on ${new Date(
        date
      ).toDateString()} at ${time}`
    );

    res.status(201).json({
      success: true,
      message: "Meeting created & notifications sent",
      data: meeting,
    });
  } catch (error) {
    console.error("CreateMeeting Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllUserMeeting = async (req, res) => {
  try {
    const Meeting = await MeetingDataModule.find()
    .populate("userId", "username");
    
    if (!Meeting) {
      return res.status(404).json({ msg: "Data Not Found" });
    }
    res.status(200).json({success: true,
      data: Meeting});
  } catch (error) {
    res.status(500).json({ error: "Error fetching Meetings" });
  }
};

export const GetMeeting = async (req, res) => {
  try {
    const Meeting = await MeetingDataModule.find({
    userId: req.userId,
  })
    .populate("leadId", "companyname area domain")
    .sort({ created_at: -1 });
    if (!Meeting) {
      return res.status(404).json({ msg: "Data Not Found" });
    }
    res.status(200).json({success: true,
      data: Meeting});
  } catch (error) {
    res.status(500).json({ error: "Error fetching Meetings" });
  }
};

export const GetMeetingId = async (req, res) => {
  const id = req.params.id;

  try {
   const MeetingId = await MeetingDataModule.findOne({
  _id: req.params.id,
    userId: req.userId,
});

    if (!MeetingId) {
      return res.status(404).json({ msg: "user data not found" });
    }
    res.status(200).json({data: MeetingId});
  } catch (error) {
    console.error("Error fetching Meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

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
     { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
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
    userId: req.userId,
    });
    res.status(200).json({ msg: "user deleted data successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Meeting" });
  }
};


export const RescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    const meeting = await MeetingDataModule.findById(id);
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    meeting.reschedule = {
      isRescheduled: true,
      oldDate: meeting.date,
      oldTime: meeting.time,
      newDate,
      newTime,
      reason,
    };

    meeting.date = newDate;
    meeting.time = newTime;
    meeting.status = "rescheduled";

    await meeting.save();

    res.json({
      success: true,
      message: "Meeting rescheduled successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const AddFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const { purpose,
      visitNote, nextMeetingDate, nextMeetingTime, nextFollowUpDate,
      nextFollowUpTime,
      nextFollowUpNote, } = req.body;

    const meeting = await MeetingDataModule.findById(id);
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

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
    };

    meeting.status = "completed";

    await meeting.save();

    res.json({
      success: true,
      message: "Follow-up added successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
