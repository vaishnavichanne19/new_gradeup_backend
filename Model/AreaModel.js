import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
    areaname: {
        type: String
    }
})

export  const AreaModuleData = mongoose.model("area", AreaSchema);
