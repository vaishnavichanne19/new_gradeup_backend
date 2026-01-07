import { LeadModuleData } from "../Model/LeadModel.js";
import { MeetingDataModule } from "../Model/MeetingModel.js";

export const createLead = async (req, res) => {
  try {
    const {
      area,
      companyname,
      companyphone,
      ownerName,
      ownerphone,
      domain,
      customDomain,
      marketingType,
      marketingOptions,
    } = req.body;

    const LeadId = new LeadModuleData({
      area: area.trim(),
      companyname: companyname.trim(),
      companyphone,
      ownerName: ownerName.trim(),
      ownerphone,
      domain,
      customDomain: domain === "Other" ? customDomain : "",
      marketingType,
      marketingOptions,
      userId: req.user.userId,
    });

    if (!LeadId) {
      res.status(404).json({ msg: "Data not found" });
    }
    await LeadId.save();
    res
      .status(200)
      .json({ message: "Lead Data added successfully", data: LeadId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetLead = async (req, res) => {
  try {
    const Leads = await LeadModuleData.find({userId: req.user.userId}).sort({ created_at: -1 });

    if (!Leads || Leads.length === 0) {
      return res.status(404).json({ msg: "Data Not Found" });
    }

    res.status(200).json(Leads);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Leads" });
  }
};

export const GetAllUserLead = async (req, res) => {
  try {
    const Leads = await LeadModuleData.find()
    .populate("userId", "username email");

    if (!Leads) {
      return res.status(404).json({ msg: "Data Not Found" });
    }

    res.status(200).json({success: true, data: Leads});
  } catch (error) {
    res.status(500).json({ error: "Error fetching Leads" });
  }
};

export const GetLeadId = async (req, res) => {

  try {
   const Lead = await LeadModuleData.findOne({
  _id: req.params.id,
  userId: req.user.userId,
});


    if (!Lead) {
      return res.status(404).json({
        success: false,
        message: "User data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: Lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const leaddata = await LeadModuleData.findById(id);
    if (!leaddata) {
      return res.status(404).json({
        success: false,
        msg: "User Data not found",
      });
    }

 const updateData = {
      ...req.body,
      marketingOptions: req.body.marketingOptions || [],
    };

    const updatedLead = await LeadModuleData.findByIdAndUpdate(
     { _id: id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedLead,
      msg: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating Lead:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await LeadModuleData.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!lead) {
      return res.status(404).json({ msg: "Lead not found or not authorized" });
    }

    // ✅ Delete related meetings
    await MeetingDataModule.deleteMany({
      leadId: id,
      userId: req.user.userId,
    });

    // ✅ Delete lead safely
    await LeadModuleData.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,
      msg: "Lead & all related meetings deleted",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    res.status(500).json({ error: "Error deleting Lead" });
  }
};

