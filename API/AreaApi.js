import { AreaModuleData } from "../Model/AreaModel.js";

export const createArea = async (req, res) => {
  try {
    const { areaname } = req.body;

    const AreaId = new AreaModuleData({
      areaname,
    });

  const existdata = await AreaModuleData.findOne({areaname});

  if(existdata) {
   return res.status(409).json({message: "Data Already Exist"})
  }
    await AreaId.save();
    res
      .status(200)
      .json({ message: "Area Data added successfully", data: AreaId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllArea = async (req, res) => {
  try {
    const Areas = await AreaModuleData.find();
    if (!Areas) {
      return res.status(404).json({ msg: "Data Not Found" });
    }

    res.status(200).json({ success: true, data: Areas });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Areas" });
  }
};

