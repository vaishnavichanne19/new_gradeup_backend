import { LeadModuleData } from "../Model/LeadModel.js";

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
    const Leads = await LeadModuleData.find();

    if (!Leads || Leads.length === 0) {
      return res.status(404).json({ msg: "Data Not Found" });
    }

    res.status(200).json(Leads);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Leads" });
  }
};

export const GetLeadId = async (req, res) => {
  const { id } = req.params;

  try {
    const Lead = await LeadModuleData.findById(id);

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

    // 🔐 SAFE DEFAULTS (CONFUSION YAHI THA)
    const updateData = {
      ...req.body,
      marketingOptions: req.body.marketingOptions || [],
    };

    const updatedLead = await LeadModuleData.findByIdAndUpdate(
      id,
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
    const id = req.params.id;

    const deletedLead = await LeadModuleData.findById(id);

    if (!deletedLead) {
      return res.status(404).json({ msg: "User data not found" });
    }
    await LeadModuleData.findByIdAndDelete(id);
    res.status(200).json({ msg: "user deleted data successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Lead" });
  }
};
